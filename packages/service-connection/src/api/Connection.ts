import { Observable } from 'rxjs';

export type EventType =
  | 'connectionStarted'
  | 'connectionCompleted'
  | 'disconnectionStarted'
  | 'disconnectionCompleted'
  | 'error'
  | 'messageSent'
  | 'messageReceived';

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
  /**
   * Checks if a provided connection is active
   * Will throw an error if a request is not correct
   */
  isConnectionOpened(isConnectedRequest: IsConnectedRequest): boolean;
}

export interface OpenConnectionRequest {
  envKey: string;
  endpoint: string;
}

export interface CloseConnectionRequest {
  envKey: string;
}

export interface SendMessageRequest {
  envKey: string;
  data: any;
  model?: 'request/response' | 'request/stream';
}

export interface Events$Request {}

export interface IsConnectedRequest {
  envKey: string;
}

export interface ConnectionEvent {
  type: EventType;
  envKey: string;
  data?: any;
}

export type Provider = 'websocket' | 'rsocket';
