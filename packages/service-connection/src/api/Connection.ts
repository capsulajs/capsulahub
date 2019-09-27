import { Observable } from 'rxjs';

export interface ConnectionConfig {
  provider: Provider;
  serviceName: string;
}

export type Provider = 'websocket' | 'rsocket';

export type ConnectingEvent = 'connecting';

export type ConnectedEvent = 'connected';

export type DisconnectingEvent = 'disconnecting';

export type DisconnectedEvent = 'disconnecting';

export type ErrorEvent = 'error';

export type MessageSentEvent = 'messageSent';

export type MessageReceivedEvent = 'messageReceived';

export type EventType =
  | ConnectingEvent
  | ConnectedEvent
  | DisconnectingEvent
  | DisconnectedEvent
  | ErrorEvent
  | MessageSentEvent
  | MessageReceivedEvent;

export interface Connection {
  /**
   * Establish a new socket connection
   * @returns
   * A Promise that will be resolved when a new connection will be established
   * The promise can be rejected if
   * - openConnectionRequest is not correct
   * - there is an error while establishing the connection
   * - "pending connection" exists
   * - connection is already established for `envKey`
   */
  open(openConnectionRequest: OpenConnectionRequest): Promise<void>;
  /**
   * Disconnect from a provided connection
   * @returns
   * A Promise that will be resolved when a disconnection has been provided
   * The promise can be rejected if
   * - closeConnectionRequest is not correct
   * - no connection has been currently established for envKey
   * - "pending closing of connection" exists
   */
  close(closeConnectionRequest: CloseConnectionRequest): Promise<void>;
  /**
   * Send a message to a currently connected env.
   * If there is a connection in "pending" state - the method will wait for a new connection to be established before sending.
   * @returns
   * A Promise that will be resolved when a message has been sent
   * The promise can be rejected if:
   * - sendMessageRequest is not correct
   * - no connection has been established and no connection is in "pending" state
   * - connection, that was in "pending" state, failed to be established
   * - "pending closing of connection" exists
   */
  send(sendMessageRequest: SendMessageRequest): Promise<void>;
  /**
   * Get a stream of events
   * @returns
   * An Observable, that will emit all the possible events
   */
  events$(events$Request: Events$Request): Observable<ConnectionEvent>;
}

export interface OpenConnectionRequest {
  envKey: string;
  endpoint: string;
}

export interface CloseConnectionRequest {
  envKey: string;
}

export type AsyncModel = 'request/response' | 'request/stream';

export interface SendMessageRequest {
  envKey: string;
  data: any;
  model?: AsyncModel;
}

export interface Events$Request {}

export interface ConnectionEvent {
  type: EventType;
  envKey: string;
  data?: any;
}
