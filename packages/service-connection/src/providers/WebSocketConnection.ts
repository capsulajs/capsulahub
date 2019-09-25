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

export default class WebSocketConnection implements ConnectionInterface {
  private connections: {
    [envKey: string]: { connectedWs: Promise<WebSocket>; wsDisconnected: Promise<void>; readyState: any };
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

      return connection.connectedWs
        .then((ws) => {
          ws.close();
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

      return this.connections[envKey].connectedWs
        .then((ws) => {
          ws.send(typeof data === 'string' ? data : JSON.stringify(data));
          this.receivedEvents$.next({ envKey, type: eventTypes.messageSent as Partial<EventType>, data });
          resolve();
        })
        .catch((err) => reject(new Error(err)));
    });
  };

  public events$ = (_: Events$Request) => {
    return this.receivedEvents$.asObservable();
  };

  private createNewConnection = ({ envKey, endpoint }: OpenConnectionRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(endpoint);
        const receivedEventsForCurrentConnection$ = this.receivedEvents$.pipe(
          filter((event: ConnectionEvent) => event.envKey === envKey)
        );
        const connectedWs = new Promise<WebSocket>((resolveWithWs, rejectConnection) => {
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
                  resolveWithWs(ws);
                  break;
                }
                case eventTypes.error: {
                  rejectConnection(event.data);
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
          [envKey]: { connectedWs, wsDisconnected, readyState: eventTypes.connectionStarted },
        };
        this.receivedEvents$.next({ envKey, type: eventTypes.connectionStarted as Partial<EventType> });

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

        ws.onerror = (event: Event) => {
          this.receivedEvents$.next({
            envKey,
            data: event,
            type: eventTypes.error as Partial<EventType>,
          });
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
          reject(new Error(messages.connectionError));
        };

        ws.onclose = () => {
          this.connections[envKey] = { ...this.connections[envKey], readyState: eventTypes.disconnectionCompleted };
          this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
        };
      } catch (error) {
        // this.receivedEvents$.next({
        //   envKey,
        //   data: error.message,
        //   type: eventTypes.error as Partial<EventType>,
        // });
        this.connections[envKey].readyState = eventTypes.disconnectionCompleted;
        reject(messages.connectionError);
      }
    });
  };
}
