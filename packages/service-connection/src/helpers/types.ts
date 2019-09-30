import { API } from '..';

export type ReadyState = API.ConnectingEvent | API.ConnectedEvent | API.DisconnectingEvent | API.DisconnectedEvent;

export interface ValidateByReadyStateRequest {
  connection?: { readyState: ReadyState; [prop: string]: any };
  envKey: string;
}
