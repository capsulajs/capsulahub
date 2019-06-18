export interface PrepareWebComponentRequest {
  bootstrap: () => Promise<new () => HTMLElement>;
  name: string;
  mountId: string;
}
