import { Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
// @ts-ignore
import RSocketWebSocketClient from 'rsocket-websocket-client';
// @ts-ignore
import { RSocketClient, JsonSerializers } from 'rsocket-core';
import {
  CloseConnectionRequest,
  Connection as ConnectionInterface,
  ConnectionEvent,
  Events$Request,
  EventType,
  OpenConnectionRequest,
  SendMessageRequest,
} from '../api';
import { asyncModels, eventTypes, messages } from '../consts';
import { isCloseReqValid, isOpenReqValid, isSendReqValid, isRSocketModelValid } from '../helpers/validators';

type RsConnection = Promise<{
  socket?: any;
  error?: string;
}>;

export default class RSocketConnection implements ConnectionInterface {
  private connections: {
    [envKey: string]: { rsConnection: RsConnection; client: RSocketClient; readyState: any };
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
        .catch(reject);
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
      this.connections[envKey].client.close();
      return Promise.resolve().then(() => {
        this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
        resolve();
      });
    });
  };

  public send = (sendMessageRequest: SendMessageRequest): Promise<void> => {
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
        (connection && connection.readyState === eventTypes.disconnectionStarted) ||
        !connection ||
        connection.readyState === eventTypes.disconnectionCompleted
      ) {
        return reject(new Error(messages.noConnection(envKey)));
      }

      return this.connections[envKey].rsConnection.then(({ socket, error }) => {
        if (socket) {
          if (model === asyncModels.requestResponse) {
            socket.requestResponse({ data: (data || {}).data, metadata: (data || {}).metadata }).subscribe({
              onComplete: (response: any) => {
                this.receivedEvents$.next({
                  envKey,
                  data: JSON.stringify(response.data || ''),
                  type: eventTypes.messageReceived as Partial<EventType>,
                });
              },
              onError: (requestResponseError: any) => {
                this.receivedEvents$.next({
                  envKey,
                  data: requestResponseError.source,
                  type: eventTypes.error as Partial<EventType>,
                });
              },
            });
            this.receivedEvents$.next({ envKey, type: eventTypes.messageSent as Partial<EventType>, data });
            resolve();
          } else if (model === asyncModels.requestStream) {
            socket.requestStream({ data: (data || {}).data, metadata: (data || {}).metadata }).subscribe({
              onSubscribe(subscription: any) {
                subscription.request(2147483647);
              },
              onNext: (response: any) => {
                this.receivedEvents$.next({
                  envKey,
                  data: JSON.stringify(response.data || ''),
                  type: eventTypes.messageReceived as Partial<EventType>,
                });
              },
              onError: (requestStreamError: Error) => {
                if (!requestStreamError.message.includes('The connection was closed.')) {
                  this.receivedEvents$.next({
                    envKey,
                    data: requestStreamError.message,
                    type: eventTypes.error as Partial<EventType>,
                  });
                }
              },
            });
            this.receivedEvents$.next({ envKey, type: eventTypes.messageSent as Partial<EventType>, data });
            resolve();
          }
        } else if (error) {
          reject(new Error(error));
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
          type: eventTypes.error as Partial<EventType>,
        });
        this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
      }

      const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
        filter((event: ConnectionEvent) => event.envKey === envKey)
      );
      const rsConnection: RsConnection = new Promise((resolveRs) => {
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
        [envKey]: { rsConnection, client, readyState: eventTypes.connectionStarted },
      };

      client.connect().subscribe({
        onComplete: (rsSocket: any) => {
          socket = rsSocket;
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.connectionCompleted };
          this.receivedEvents$.next({ envKey, type: eventTypes.connectionCompleted as Partial<EventType> });
          resolve();
        },
        onError: () => {
          this.receivedEvents$.next({
            envKey,
            data: messages.connectionError,
            type: eventTypes.error as Partial<EventType>,
          });
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
          // TODO Where to emit disconnection completed?
          this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
          reject(new Error(messages.connectionError));
        },
      });
    });
  };
}
