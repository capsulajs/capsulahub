import { Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import {
  CloseConnectionRequest,
  Connection as ConnectionInterface,
  ConnectionEvent,
  Events$Request,
  EventType,
  OpenConnectionRequest,
  SendMessageRequest,
} from '../api';
import { eventTypes, messages } from '../consts';
import { isCloseReqValid, isOpenReqValid, isSendReqValid } from '../helpers/validators';

type WsConnection = Promise<{
  ws?: WebSocket;
  error?: string;
}>;

export default class WebSocketConnection implements ConnectionInterface {
  private connections: {
    [envKey: string]: { wsConnection: WsConnection; wsDisconnected: Promise<void>; readyState: any };
  };
  private readonly receivedEvents$: Subject<ConnectionEvent>;

  constructor() {
    this.connections = {};
    this.receivedEvents$ = new Subject<ConnectionEvent>();
  }

  public open = (openConnectionRequest: OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isOpenReqValid(openConnectionRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, endpoint } = openConnectionRequest;
      const connection = this.connections[envKey] || undefined;

      if (connection && connection.readyState === eventTypes.connectionStarted) {
        return reject(new Error(messages.pendingConnection(envKey)));
      }
      if (connection && connection.readyState === eventTypes.connectionCompleted) {
        return reject(new Error(messages.alreadyConnected(envKey)));
      }

      return this.createNewConnection({ envKey, endpoint })
        .then(resolve)
        .catch((error) => {
          reject(error);
        });
    });
  };

  public close = (closeConnectionRequest: CloseConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isCloseReqValid(closeConnectionRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey } = closeConnectionRequest;
      const connection = this.connections[envKey] || undefined;

      if (connection && connection.readyState === eventTypes.disconnectionStarted) {
        return reject(new Error(messages.pendingDisconnection(envKey)));
      }
      if (!connection || connection.readyState === eventTypes.disconnectionCompleted) {
        return reject(new Error(messages.noConnection(envKey)));
      }

      this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionStarted };
      this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionStarted as Partial<EventType> });

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

  public send = (sendMessageRequest: SendMessageRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSendReqValid(sendMessageRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, data } = sendMessageRequest;
      const connection = this.connections[envKey] || undefined;

      if (
        (connection && connection.readyState === eventTypes.disconnectionStarted) ||
        !connection ||
        connection.readyState === eventTypes.disconnectionCompleted
      ) {
        return reject(new Error(messages.noConnection(envKey)));
      }

      return this.connections[envKey].wsConnection.then(({ ws, error }) => {
        if (ws) {
          ws.send(typeof data === 'string' ? data : JSON.stringify(data));
          this.receivedEvents$.next({ envKey, type: eventTypes.messageSent as Partial<EventType>, data });
          return resolve();
        }
        if (error) {
          return reject(new Error(error));
        }
      });
    });
  };

  public events$ = (_: Events$Request) => {
    return this.receivedEvents$.asObservable();
  };

  private createNewConnection = ({ envKey, endpoint }: OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.receivedEvents$.next({ envKey, type: eventTypes.connectionStarted as Partial<EventType> });
      let ws: WebSocket;
      try {
        ws = new WebSocket(endpoint);
      } catch (error) {
        this.receivedEvents$.next({
          envKey,
          data: error.message,
          type: eventTypes.error as Partial<EventType>,
        });
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
        return reject(new Error(messages.connectionError));
      }

      const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
        filter((event: ConnectionEvent) => event.envKey === envKey)
      );
      const wsConnection: WsConnection = new Promise((resolveWS) => {
        receivedEventsForCurrentConnection$
          .pipe(
            filter(
              (event: ConnectionEvent) =>
                event.type === eventTypes.connectionCompleted || event.type === eventTypes.error
            ),
            first()
          )
          .subscribe((event) => {
            switch (event.type) {
              case eventTypes.connectionCompleted: {
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
            filter((event: ConnectionEvent) => event.type === eventTypes.disconnectionCompleted),
            first()
          )
          .subscribe(() => {
            resolveWhenDisconnected();
          });
      });

      this.connections = {
        ...this.connections,
        [envKey]: { wsConnection, wsDisconnected, readyState: eventTypes.connectionStarted },
      };

      ws.onopen = () => {
        this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.connectionCompleted };
        this.receivedEvents$.next({ envKey, type: eventTypes.connectionCompleted as Partial<EventType> });
        resolve();
      };

      ws.onmessage = (event: MessageEvent) => {
        this.receivedEvents$.next({
          envKey,
          data: event.data || '',
          type: eventTypes.messageReceived as Partial<EventType>,
        });
      };

      ws.onerror = () => {
        this.receivedEvents$.next({
          envKey,
          data: messages.connectionError,
          type: eventTypes.error as Partial<EventType>,
        });
        reject(new Error(messages.connectionError));
      };

      ws.onclose = () => {
        this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
      };
    });
  };
}
