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
import { eventTypes, messages } from '../consts';
import { isCloseReqValid, isOpenReqValid, isSendReqValid } from '../helpers/validators';

export default class RSocketConnection implements ConnectionInterface {
  private connections: {
    [envKey: string]: { connectedRs: Promise<any>; client: RSocketClient; readyState: any };
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
      this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
      this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
      resolve();
    });
  };

  public send = (sendMessageRequest: SendMessageRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSendReqValid(sendMessageRequest)) {
        return reject(new Error(messages.invalidRequest));
      }

      const { envKey, model, data } = sendMessageRequest;
      const connection = this.connections[envKey] || undefined;

      if (
        (connection && connection.readyState === eventTypes.disconnectionStarted) ||
        !connection ||
        connection.readyState === eventTypes.disconnectionCompleted
      ) {
        return reject(new Error(messages.noConnection(envKey)));
      }

      this.connections[envKey].connectedRs.then((socket) => {
        const { d, ...metadata } = data;
        if (model === 'request/response') {
          socket.requestResponse({ data: d, metadata }).subscribe({
            onComplete: (response: any) => {
              this.receivedEvents$.next({
                envKey,
                data: response || '',
                type: eventTypes.messageReceived as Partial<EventType>,
              });
            },
            onError: (error: any) => {
              console.log('onError send', error.source);

              this.receivedEvents$.next({
                envKey,
                data: error.message,
                type: eventTypes.error as Partial<EventType>,
              });
            },
          });
          this.receivedEvents$.next({ envKey, type: eventTypes.messageSent as Partial<EventType>, data });
          resolve();
        } else if (model === 'request/stream') {
          socket.requestStream({ data: d, metadata }).subscribe({
            onSubscribe(subscription: any) {
              subscription.request(2147483647);
            },
            onNext: (response: any) => {
              this.receivedEvents$.next({
                envKey,
                data: response || '',
                type: eventTypes.messageReceived as Partial<EventType>,
              });
            },
            onComplete: () => {
              console.log('request/stream has been completed');
            },
            onError: (error: Error) => {
              this.receivedEvents$.next({
                envKey,
                data: error.message,
                type: eventTypes.error as Partial<EventType>,
              });
            },
          });
        }
      });
    });
  };

  public events$ = (_: Events$Request) => {
    return this.receivedEvents$.asObservable();
  };

  private createNewConnection = ({ envKey, endpoint }: OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        let socket: any;
        const client = new RSocketClient({
          serializers: JsonSerializers,
          setup: {
            dataMimeType: 'application/json',
            keepAlive: 100000,
            lifetime: 100000,
            metadataMimeType: 'application/json',
          },
          transport: new RSocketWebSocketClient({ url: endpoint }),
        });

        const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
          filter((event: ConnectionEvent) => event.envKey === envKey)
        );
        const connectedRs = new Promise<any>((resolveWithRs, rejectConnection) => {
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
                  resolveWithRs(socket);
                  break;
                }
                case eventTypes.error: {
                  rejectConnection(event.data);
                  break;
                }
              }
            });
        });

        this.connections = {
          ...this.connections,
          [envKey]: { connectedRs, client, readyState: eventTypes.connectionStarted },
        };
        this.receivedEvents$.next({ envKey, type: eventTypes.connectionStarted as Partial<EventType> });

        client.connect().subscribe({
          onComplete: (rsSocket: any) => {
            socket = rsSocket;
            this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.connectionCompleted };
            this.receivedEvents$.next({ envKey, type: eventTypes.connectionCompleted as Partial<EventType> });
            resolve();
          },
          onError: (error: Error) => {
            this.receivedEvents$.next({
              envKey,
              data: error.message,
              type: eventTypes.error as Partial<EventType>,
            });
            this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
            console.log('Connection to rsocket has failed', error);
            reject(new Error(`RSocket Connection error: ${error.message}`));
          },
        });
      } catch (error) {
        this.connections[envKey].readyState = eventTypes.disconnectionCompleted;
        reject(messages.connectionError);
      }
    });
  };
}
