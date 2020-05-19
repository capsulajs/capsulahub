import { Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import WebSocketForNode from 'ws';
import { API } from '..';
import { eventTypes, messages } from '../consts';
import {
  isCloseReqValid,
  isOpenReqValid,
  isSendReqValid,
  validateReadyStateForOpen,
  validateReadyStateForClose,
  validateReadyStateForSend,
} from '../helpers/validators';
import { ReadyState } from '../helpers/types';
import { ConnectionOptions } from '../api/Connection';

type WsConnection = Promise<{ ws?: WebSocket | WebSocketForNode; error?: string }>;

export default class WebSocketConnection implements API.Connection {
  private connections: {
    [envKey: string]: {
      wsConnection: WsConnection;
      wsDisconnected: Promise<void>;
      readyState: ReadyState;
      endpoint: string;
    };
  };
  private readonly receivedEvents$: Subject<API.ConnectionEventData>;
  private pingIntervalId?: any;

  constructor({ pingInterval }: ConnectionOptions = {}) {
    this.connections = {};
    this.receivedEvents$ = new Subject<API.ConnectionEventData>();

    if (pingInterval) {
      this.receivedEvents$
        .pipe(filter(({ type }) => type === eventTypes.connected || type === eventTypes.disconnected))
        .subscribe(({ type, envKey }) => {
          if (type === eventTypes.connected) {
            this.pingIntervalId = setInterval(async () => {
              const { ws } = await this.connections[envKey].wsConnection;
              if (typeof window === 'undefined') {
                // NodeJS ping
                (ws as WebSocketForNode).ping('ping');
              } else {
                // Browser ping
                this.send({ envKey, data: 'ping' });
              }
            }, pingInterval);
          } else if (type === eventTypes.disconnected) {
            clearInterval(this.pingIntervalId as number);
            this.pingIntervalId = undefined;
          }
        });
    }
  }

  public open = (openConnectionRequest: API.OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isOpenReqValid(openConnectionRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, endpoint, headers } = openConnectionRequest;
      if (!!this.connections[envKey]) {
        try {
          validateReadyStateForOpen({ connection: this.connections[envKey], envKey });
        } catch (error) {
          return reject(error);
        }
      }

      return this.createNewConnection({ envKey, endpoint, headers })
        .then(resolve)
        .catch((error) => {
          reject(error);
        });
    });
  };

  public close = (closeConnectionRequest: API.CloseConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isCloseReqValid(closeConnectionRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey } = closeConnectionRequest;
      const connection = this.connections[envKey];
      try {
        validateReadyStateForClose({ connection, envKey });
      } catch (error) {
        return reject(error);
      }

      this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnecting };
      this.receivedEvents$.next({
        envKey,
        type: eventTypes.disconnecting,
        endpoint: this.connections[envKey].endpoint,
      });

      return connection.wsConnection
        .then(({ ws, error }) => {
          ws && ws.close();
          if (error) {
            throw new Error(error);
          }
        })
        .then(() => connection.wsDisconnected)
        .then(resolve);
    });
  };

  public send = (sendMessageRequest: API.SendMessageRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSendReqValid(sendMessageRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, data } = sendMessageRequest;
      const connection = this.connections[envKey];
      try {
        validateReadyStateForSend({ connection, envKey });
      } catch (error) {
        return reject(error);
      }

      return this.connections[envKey].wsConnection.then(({ ws, error }) => {
        if (ws) {
          ws.send(typeof data === 'string' ? data : JSON.stringify(data));
          this.receivedEvents$.next({
            envKey,
            type: eventTypes.messageSent,
            data,
            endpoint: this.connections[envKey].endpoint,
          });
          return resolve();
        }
        if (error) {
          return reject(new Error(error));
        }
      });
    });
  };

  public events$ = (_: API.Events$Request) => {
    return this.receivedEvents$.asObservable();
  };

  private createNewConnection = ({ envKey, endpoint, headers }: API.OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.receivedEvents$.next({ envKey, type: eventTypes.connecting, endpoint });
      let ws: WebSocket | WebSocketForNode;
      try {
        ws = typeof window === 'undefined' ? new WebSocketForNode(endpoint, { headers }) : new WebSocket(endpoint);
      } catch (error) {
        this.receivedEvents$.next({
          envKey,
          data: error.message,
          type: eventTypes.error,
          endpoint,
        });
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnected, endpoint });
        return reject(new Error(messages.connectionError));
      }

      const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
        filter((event: API.ConnectionEventData) => event.envKey === envKey)
      );
      const wsConnection: WsConnection = new Promise((resolveWS) => {
        receivedEventsForCurrentConnection$
          .pipe(
            filter(
              (event: API.ConnectionEventData) => event.type === eventTypes.connected || event.type === eventTypes.error
            ),
            first()
          )
          .subscribe((event) => {
            switch (event.type) {
              case eventTypes.connected: {
                resolveWS({ ws });
                break;
              }
              case eventTypes.error: {
                resolveWS({ error: event.data });
                break;
              }
            }
          });
      });
      const wsDisconnected = new Promise<void>((resolveWhenDisconnected) => {
        receivedEventsForCurrentConnection$
          .pipe(
            filter((event: API.ConnectionEventData) => event.type === eventTypes.disconnected),
            first()
          )
          .subscribe(() => {
            resolveWhenDisconnected();
          });
      });

      this.connections = {
        ...this.connections,
        [envKey]: { wsConnection, wsDisconnected, readyState: eventTypes.connecting, endpoint },
      };

      ws.onopen = () => {
        this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.connected };
        this.receivedEvents$.next({ envKey, type: eventTypes.connected, endpoint });
        resolve();
      };

      ws.onmessage = (event: MessageEvent) => {
        this.receivedEvents$.next({
          envKey,
          data: event.data || '',
          type: eventTypes.messageReceived,
          endpoint,
        });
      };

      ws.onerror = (error?: WebSocketForNode.ErrorEvent) => {
        const errorMessage = error && error.message ? error.message : messages.connectionError;
        this.receivedEvents$.next({
          envKey,
          data: errorMessage,
          type: eventTypes.error,
          endpoint,
        });
        reject(new Error(errorMessage));
      };

      ws.onclose = () => {
        this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnected };
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnected, endpoint });
      };
    });
  };
}
