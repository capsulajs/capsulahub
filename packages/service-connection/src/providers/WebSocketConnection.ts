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
import { connectionEventType, messages, wsReadyStates } from '../consts';
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
      if (connection && connection.readyState === wsReadyStates.connecting) {
        reject(new Error(messages.pendingConnection(envKey)));
      }
      if (connection && connection.readyState === wsReadyStates.connected) {
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
      if (connection && connection.readyState === wsReadyStates.disconnecting) {
        reject(new Error(messages.pendingDisconnection(envKey)));
      }
      if (!connection || connection.readyState === wsReadyStates.disconnected) {
        reject(new Error(messages.noConnection(envKey)));
      }
      // @ts-ignore
      this.connections[envKey].ws && this.connections[envKey].ws.close();
      resolve();
    });
  };

  public send = (sendMessageRequest: SendMessageRequest): Promise<void> => {
    const { envKey, data } = sendMessageRequest;
    const connection = this.connections[envKey] || undefined;
    return new Promise((resolve, reject) => {
      if (
        (connection && connection.readyState === wsReadyStates.disconnecting) ||
        !connection ||
        connection.readyState === wsReadyStates.disconnected
      ) {
        reject(new Error(messages.noConnection(envKey)));
      }
      if (connection && connection.readyState === wsReadyStates.connecting) {
        this.send(sendMessageRequest).catch(() => reject(new Error(messages.failedToSend)));
      }
      // @ts-ignore
      !!this.connections[envKey].ws &&
        this.connections[envKey].ws!.send(typeof data === 'string' ? data : JSON.stringify(data));
      resolve();
    });
  };

  public events$ = (_: Events$Request) => {
    return this.receivedEvents$;
  };

  public isConnectionOpened = (isConnectedRequest: IsConnectedRequest) => {
    const { envKey } = isConnectedRequest;
    return this.connections[envKey] && this.connections[envKey].readyState === wsReadyStates.connected;
  };

  private createNewConnection = ({ envKey, endpoint }: OpenConnectionRequest) => {
    return new Promise((resolve, reject) => {
      try {
        this.connections = { ...this.connections, envKey: { readyState: wsReadyStates.connecting } };
        const ws = new WebSocket(endpoint);
        ws.onopen = () => {
          this.connections[envKey] = { ...this.connections[envKey], ws, readyState: wsReadyStates.connected };
          resolve();
        };

        ws.onmessage = (event: MessageEvent) => {
          this.receivedEvents$.next({
            envKey,
            data: event.data || '',
            type: connectionEventType.response as Partial<EventType>,
          });
        };

        ws.onerror = (event: Event) => {
          this.receivedEvents$.next({
            envKey,
            data: event,
            type: connectionEventType.error as Partial<EventType>,
          });
        };

        ws.onclose = () => {
          this.connections[envKey] = { ws: undefined, readyState: wsReadyStates.disconnected };
        };
      } catch (error) {
        this.connections[envKey].readyState = wsReadyStates.disconnected;
        reject(error);
      }
    });
  };
}
