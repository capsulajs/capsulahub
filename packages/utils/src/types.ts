export interface PrepareComponentRequest {
  bootstrap: () => Promise<new () => HTMLElement>;
  name: string;
  mountId: string;
}
