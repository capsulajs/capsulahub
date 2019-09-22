import EventEmitter from 'events';

// @ts-ignore
const realWs = window.WebSocket;

class FakeWebSocket {
  private readonly eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    // @ts-ignore
    window.socket = this;
    // @ts-ignore
    return this.eventEmitter;
  }

  public actions(type: any, data: any) {
    this.eventEmitter.emit(type, data);
  }
}

const mockConfig = (mock: boolean) => {
  // @ts-ignore
  window.WebSocket = mock ? FakeWebSocket : realWs;
};

mockConfig(false);

const mockOpenResponse = (data: any) => {
  // @ts-ignore
  window.socket.actions('open', data);
};

const mockIsConnectionOpenedResponse = (state: any) => {
  // @ts-ignore
  window.socket.readyState = state;
};

export { mockOpenResponse, mockIsConnectionOpenedResponse, mockConfig };
