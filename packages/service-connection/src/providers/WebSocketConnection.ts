import {
  CloseConnectionRequest,
  Connection as ConnectionInterface,
  ConnectionEvent,
  Events$Request,
  EventType,
  IsConnectedRequest,
  OpenConnectionRequest,
  SendMessageRequest,
} from '../api';
import { eventTypes, messages } from '../consts';
import { Subject } from 'rxjs';

export default class WebSocketConnection implements ConnectionInterface {
  private connections: { [envKey: string]: { ws?: WebSocket; readyState: any } };
  private readonly receivedEvents$: Subject<ConnectionEvent>;

  constructor() {
    this.connections = {};
    this.receivedEvents$ = new Subject<ConnectionEvent>();
  }

  public open = (openConnectionRequest: OpenConnectionRequest): Promise<void> => {
    const { envKey, endpoint } = openConnectionRequest;
    const connection = this.connections[envKey] || undefined;
    return new Promise((resolve, reject) => {
      if (connection && connection.readyState === eventTypes.connectionStarted) {
        reject(new Error(messages.pendingConnection(envKey)));
      }
      if (connection && connection.readyState === eventTypes.connectionCompleted) {
        reject(new Error(messages.alreadyConnected(envKey)));
      }
      this.createNewConnection({ envKey, endpoint })
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  };

  public close = (closeConnectionRequest: CloseConnectionRequest): Promise<void> => {
    const { envKey } = closeConnectionRequest;
    const connection = this.connections[envKey] || undefined;
    return new Promise((resolve, reject) => {
      if (connection && connection.readyState === eventTypes.disconnectionStarted) {
        reject(new Error(messages.pendingDisconnection(envKey)));
      }
      if (!connection || connection.readyState === eventTypes.disconnectionCompleted) {
        reject(new Error(messages.noConnection(envKey)));
      }
      !!this.connections[envKey].ws && this.connections[envKey].ws!.close();
      resolve();
    });
  };

  public send = (sendMessageRequest: SendMessageRequest): Promise<void> => {
    const { envKey, data } = sendMessageRequest;
    const connection = this.connections[envKey] || undefined;
    return new Promise((resolve, reject) => {
      if (
        (connection && connection.readyState === eventTypes.disconnectionStarted) ||
        !connection ||
        connection.readyState === eventTypes.disconnectionCompleted
      ) {
        reject(new Error(messages.noConnection(envKey)));
      }
      // if (connection && connection.readyState === wsReadyStates.connecting) {
      //   this.send(sendMessageRequest).catch(() => reject(new Error(messages.failedToSend)));
      // }
      !!this.connections[envKey].ws &&
        this.connections[envKey].ws!.send(typeof data === 'string' ? data : JSON.stringify(data));
      this.receivedEvents$.next({ envKey, type: eventTypes.messageSent as Partial<EventType>, data });
      resolve();
    });
  };

  public events$ = (_: Events$Request) => {
    return this.receivedEvents$;
  };

  public isConnectionOpened = (isConnectedRequest: IsConnectedRequest) => {
    const { envKey } = isConnectedRequest;
    return !!this.connections[envKey] && this.connections[envKey].readyState === eventTypes.connectionCompleted;
  };

  private createNewConnection = ({ envKey, endpoint }: OpenConnectionRequest) => {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(endpoint);
        this.connections = { ...this.connections, [envKey]: { ws, readyState: eventTypes.connectionStarted } };
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
        };

        ws.onclose = () => {
          this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionStarted as Partial<EventType> });
          this.connections[envKey] = { ws: undefined, readyState: eventTypes.disconnectionCompleted };
          this.receivedEvents$.next({ envKey, type: eventTypes.disconnectionCompleted as Partial<EventType> });
        };
      } catch (error) {
        this.connections[envKey].readyState = eventTypes.disconnectionCompleted;
        reject(error);
      }
    });
  };
}
