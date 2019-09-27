import { Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
// @ts-ignore
import RSocketWebSocketClient from 'rsocket-websocket-client';
// @ts-ignore
import { RSocketClient, JsonSerializers } from 'rsocket-core';
import { API } from '..';
import { asyncModels, eventTypes, messages } from '../consts';
import { isCloseReqValid, isOpenReqValid, isSendReqValid, isRSocketModelValid } from '../helpers/validators';
import { ReadyState } from '../helpers/types';

type RsConnection = Promise<{ socket?: any; error?: string }>;

export default class RSocketConnection implements API.Connection {
  private connections: {
    [envKey: string]: { rsConnection: RsConnection; client: RSocketClient; readyState: ReadyState };
  };
  private readonly receivedEvents$: Subject<API.ConnectionEvent>;

  constructor() {
    this.connections = {};
    this.receivedEvents$ = new Subject<API.ConnectionEvent>();
  }

  public open = (openConnectionRequest: API.OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isOpenReqValid(openConnectionRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, endpoint } = openConnectionRequest;
      const connection = this.connections[envKey] || undefined;
      if (connection && connection.readyState === eventTypes.connecting) {
        return reject(new Error(messages.pendingConnection(envKey)));
      }
      if (connection && connection.readyState === eventTypes.connected) {
        return reject(new Error(messages.alreadyConnected(envKey)));
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
      const connection = this.connections[envKey] || undefined;

      if (connection && connection.readyState === eventTypes.disconnecting) {
        return reject(new Error(messages.pendingDisconnection(envKey)));
      }
      if (!connection || connection.readyState === eventTypes.disconnected) {
        return reject(new Error(messages.noConnection(envKey)));
      }

      this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnecting };
      this.receivedEvents$.next({ envKey, type: eventTypes.disconnecting });
      this.connections[envKey].client.close();
      return Promise.resolve().then(() => {
        this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnected };
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnected });
        resolve();
      });
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

      const connection = this.connections[envKey] || undefined;
      if (
        (connection && connection.readyState === eventTypes.disconnecting) ||
        !connection ||
        connection.readyState === eventTypes.disconnected
      ) {
        return reject(new Error(messages.noConnection(envKey)));
      }

      return this.connections[envKey].rsConnection.then(({ socket, error }) => {
        if (socket) {
          if (model === asyncModels.requestResponse) {
            socket.requestResponse(data).subscribe({
              onComplete: (response: any) => {
                this.receivedEvents$.next({
                  envKey,
                  data: JSON.stringify(response.data || ''),
                  type: eventTypes.messageReceived,
                });
              },
              onError: (requestResponseError: any) => {
                this.handleSubscriptionError({ envKey, error: requestResponseError });
              },
            });
            this.receivedEvents$.next({ envKey, type: eventTypes.messageSent, data });
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
                });
              },
              onError: (requestStreamError: any) => {
                this.handleSubscriptionError({ envKey, error: requestStreamError });
              },
            });
            this.receivedEvents$.next({ envKey, type: eventTypes.messageSent, data });
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
      this.receivedEvents$.next({ envKey, type: eventTypes.connecting });
      let socket: any;
      let client: RSocketClient;
      try {
        client = new RSocketClient({
          serializers: JsonSerializers,
          setup: {
            dataMimeType: 'application/json',
            keepAlive: 100000,
            lifetime: 100000,
            metadataMimeType: 'application/json',
          },
          transport: new RSocketWebSocketClient({ url: endpoint }),
        });
      } catch (error) {
        this.receivedEvents$.next({
          envKey,
          data: error.message,
          type: eventTypes.error,
        });
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnected });
      }

      const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
        filter((event: API.ConnectionEvent) => event.envKey === envKey)
      );
      const rsConnection: RsConnection = new Promise((resolveRs) => {
        receivedEventsForCurrentConnection$
          .pipe(
            filter(
              (event: API.ConnectionEvent) => event.type === eventTypes.connected || event.type === eventTypes.error
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

      this.connections = {
        ...this.connections,
        [envKey]: { rsConnection, client, readyState: eventTypes.connecting },
      };

      client.connect().subscribe({
        onComplete: (rsSocket: any) => {
          socket = rsSocket;
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.connected };
          this.receivedEvents$.next({ envKey, type: eventTypes.connected });
          resolve();
        },
        onError: () => {
          this.receivedEvents$.next({
            envKey,
            data: messages.connectionError,
            type: eventTypes.error,
          });
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnected };
          this.receivedEvents$.next({ envKey, type: eventTypes.disconnected });
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
      });
    }
  };
}
