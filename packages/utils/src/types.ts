import { Observable } from 'rxjs';

export interface PrepareWebComponentRequest {
  bootstrap: () => Promise<new () => HTMLElement>;
  name: string;
  mountId: string;
}

export interface MountWebComponentRequest {
  WebComponent: new (...args: any[]) => HTMLElement;
  name: string;
  mountId: string;
  props$?: Observable<any>;
}
