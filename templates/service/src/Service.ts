export default class Service {
  public showMessage(message: string): Promise<string> {
    return Promise.resolve(`response from Service: ${message}`);
  }
}
