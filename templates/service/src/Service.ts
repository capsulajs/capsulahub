export default class Service {
  constructor(private message: string) {}

  public showMessage(): Promise<string> {
    return Promise.resolve(`response from Service: ${this.message}`);
  }
}
