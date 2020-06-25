import { Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
// @ts-ignore
import RSocketWebSocketClient from 'rsocket-websocket-client';
// @ts-ignore
import { RSocketClient, JsonSerializers } from 'rsocket-core';
import { API } from '..';
import { asyncModels, eventTypes, messages } from '../consts';
import {
  isCloseReqValid,
  isOpenReqValid,
  isSendReqValid,
  isRSocketModelValid,
  validateReadyStateForOpen,
  validateReadyStateForClose,
  validateReadyStateForSend,
} from '../helpers/validators';
import { ReadyState } from '../helpers/types';

type RsConnection = Promise<{ socket?: any; error?: string }>;

export default class RSocketConnection implements API.Connection {
  private connections: {
    [envKey: string]: {
      rsConnection: RsConnection;
      client: RSocketClient;
      rsDisconnected: Promise<void>;
      readyState: ReadyState;
      endpoint: string;
    };
  };
  private readonly receivedEvents$: Subject<API.ConnectionEventData>;

  constructor() {
    this.connections = {};
    this.receivedEvents$ = new Subject<API.ConnectionEventData>();
  }

  public open = (openConnectionRequest: API.OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isOpenReqValid(openConnectionRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, endpoint } = openConnectionRequest;
      if (!!this.connections[envKey]) {
        try {
          validateReadyStateForOpen({ connection: this.connections[envKey], envKey });
        } catch (error) {
          return reject(error);
        }
      }

      return this.createNewConnection({ envKey, endpoint })
        .then(resolve)
        .catch(reject);
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

      return connection.rsConnection
        .then(({ error }) => {
          if (error) {
            throw new Error(error);
          }
          connection.client.close();
          return connection.rsDisconnected;
        })
        .then(resolve);
    });
  };

  public send = (sendMessageRequest: API.SendMessageRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSendReqValid(sendMessageRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, model, data } = sendMessageRequest;
      if (!isRSocketModelValid(model)) {
        return reject(new Error(messages.invalidModel));
      }

      const connection = this.connections[envKey];
      try {
        validateReadyStateForSend({ connection, envKey });
      } catch (error) {
        return reject(error);
      }

      const endpoint = this.connections[envKey].endpoint;

      return connection.rsConnection.then(({ socket, error }) => {
        if (socket) {
          if (model === asyncModels.requestResponse) {
            socket.requestResponse(data).subscribe({
              onComplete: (response: any) => {
                this.receivedEvents$.next({
                  envKey,
                  data: JSON.stringify(response.data || ''),
                  type: eventTypes.messageReceived,
                  endpoint,
                });
              },
              onError: (requestResponseError: any) => {
                this.handleSubscriptionError({ envKey, error: requestResponseError });
              },
            });
            this.receivedEvents$.next({ envKey, type: eventTypes.messageSent, data, endpoint });
            resolve();
          } else if (model === asyncModels.requestStream) {
            socket.requestStream(data).subscribe({
              onSubscribe(subscription: any) {
                subscription.request(2147483647);
              },
              onNext: (response: any) => {
                this.receivedEvents$.next({
                  envKey,
                  data: JSON.stringify(response.data || ''),
                  type: eventTypes.messageReceived,
                  endpoint,
                });
              },
              onError: (requestStreamError: any) => {
                this.handleSubscriptionError({ envKey, error: requestStreamError });
              },
            });
            this.receivedEvents$.next({ envKey, type: eventTypes.messageSent, data, endpoint });
            resolve();
          }
        } else if (error) {
          reject(new Error(error));
        }
      });
    });
  };

  public events$ = (_: API.Events$Request) => {
    return this.receivedEvents$.asObservable();
  };

  private createNewConnection = ({ envKey, endpoint }: API.OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.receivedEvents$.next({ envKey, type: eventTypes.connecting, endpoint });
      let socket: any;
      let client: RSocketClient;
      try {
        client = new RSocketClient({
          serializers: JsonSerializers,
          setup: {
            dataMimeType: 'application/json',
            keepAlive: 20000,
            lifetime: 180000,
            metadataMimeType: 'application/json',
          },
          transport: new RSocketWebSocketClient({ url: endpoint }),
        });
      } catch (error) {
        this.receivedEvents$.next({
          envKey,
          data: error.message,
          type: eventTypes.error,
          endpoint,
        });
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnected, endpoint });
      }

      const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
        filter((event: API.ConnectionEventData) => event.envKey === envKey)
      );
      const rsConnection: RsConnection = new Promise((resolveRs) => {
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
                resolveRs({ socket });
                break;
              }
              case eventTypes.error: {
                resolveRs({ error: event.data });
                break;
              }
            }
          });
      });
      const rsDisconnected: Promise<void> = new Promise((resolveRsDisconnected) => {
        receivedEventsForCurrentConnection$
          .pipe(
            filter((event: API.ConnectionEventData) => event.type === eventTypes.disconnected),
            first()
          )
          .subscribe(() => {
            resolveRsDisconnected();
          });
      });

      this.connections = {
        ...this.connections,
        [envKey]: { rsConnection, rsDisconnected, client, readyState: eventTypes.connecting, endpoint },
      };

      client.connect().subscribe({
        onComplete: (rsSocket: any) => {
          socket = rsSocket;
          const connectionStatusSub = socket.connectionStatus().subscribe({
            onSubscribe(subscription: any) {
              subscription.request(2147483647);
            },
            onNext: (response: any) => {
              if (response.kind === 'CONNECTED' && this.connections[envKey].readyState !== eventTypes.connected) {
                this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.connected };
                this.receivedEvents$.next({ envKey, type: eventTypes.connected, endpoint });
                resolve();
              } else if (response.kind === 'CLOSED') {
                this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnected };
                this.receivedEvents$.next({ envKey, type: eventTypes.disconnected, endpoint });
                connectionStatusSub.unsubscribe();
              }
            },
          });
        },
        onError: () => {
          this.receivedEvents$.next({
            envKey,
            data: messages.connectionError,
            type: eventTypes.error,
            endpoint,
          });
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnected };
          this.receivedEvents$.next({ envKey, type: eventTypes.disconnected, endpoint });
          reject(new Error(messages.connectionError));
        },
      });
    });
  };

  private handleSubscriptionError = ({ envKey, error }: { envKey: string; error: any }) => {
    if (!error.message.includes('The connection was closed.')) {
      this.receivedEvents$.next({
        envKey,
        data: error.source ? error.source.message : error.message,
        type: eventTypes.error,
        endpoint: this.connections[envKey].endpoint,
      });
    }
  };
}
