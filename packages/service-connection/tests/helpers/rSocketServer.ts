// @ts-ignore
import { RSocketServer, JsonSerializers } from 'rsocket-core';
// @ts-ignore
import RSocketWebSocketServer from 'rsocket-websocket-server';
// @ts-ignore
import { Single, Flowable } from 'rsocket-flowable';

export interface IRSocketServer {
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

const requestResponseHandler = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let responseData;
      switch (data.qualifier) {
        case '/greeting': {
          responseData = { data: { hello: `Greetings to ${data.data.name}!` } };
          break;
        }
      }
      resolve({ data: responseData });
    }, 100);
  });
};

export default class RSServer implements IRSocketServer {
  private server: RSocketServer;

  constructor() {
    this.server = new RSocketServer({
      getRequestHandler: () => {
        return {
          requestResponse({ data }: { data: any }) {
            return new Single((subscriber: any) => {
              requestResponseHandler(data).then((response) => subscriber.onComplete(response));
              subscriber.onSubscribe();
            });
          },
          requestStream({ data }: { data: any }) {
            return new Flowable((subscriber: any) => {
              let index = 0;
              let intervalId: any;
              subscriber.onSubscribe({
                cancel: () => {
                  clearInterval(intervalId);
                },
                request: (_: number) => {
                  if (data.qualifier === '/timer') {
                    intervalId = setInterval(() => {
                      subscriber.onNext({ data: { message: `Original name: ${data.data.name}`, count: index++ } });
                    }, 500);
                  }
                },
              });
            });
          },
        };
      },
      serializers: JsonSerializers,
      transport: new RSocketWebSocketServer({
        protocol: 'ws',
        host: '0.0.0.0',
        port: 8080,
      }),
    });
  }

  public start() {
    return new Promise<void>((resolve) => {
      this.server.start();
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  public stop() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.server.stop();
        resolve();
      }, 500);
    });
  }
}
