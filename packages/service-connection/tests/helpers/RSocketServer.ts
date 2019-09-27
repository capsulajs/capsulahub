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

type RequestResponseHandler = (request: { data: any; metadata: any }) => Promise<{ data: any }>;

type RequestStreamHandler = (request: { subscriber: any; data: any; metadata: any }) => any;

export interface IRSocketServerOptions {
  port?: number;
  requestResponseHandler?: RequestResponseHandler;
  requestStreamHandler?: RequestStreamHandler;
}

const defaultRequestResponseHandler: RequestResponseHandler = ({ data }) => {
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

const defaultRequestStreamHandler: RequestStreamHandler = ({ data, subscriber }) => {
  let index = 0;
  if (data.qualifier === '/timer') {
    return setInterval(() => {
      subscriber.onNext({ data: { message: `Original name: ${data.data.name}`, count: index++ } });
    }, 500);
  }
};

export default class RSServer implements IRSocketServer {
  private server: RSocketServer;

  constructor({
    port = 8080,
    requestResponseHandler = defaultRequestResponseHandler,
    requestStreamHandler = defaultRequestStreamHandler,
  }: IRSocketServerOptions) {
    this.server = new RSocketServer({
      getRequestHandler: () => {
        return {
          requestResponse({ data, metadata }: { data: any; metadata: any }) {
            return new Single((subscriber: any) => {
              requestResponseHandler({ data, metadata }).then((response) => subscriber.onComplete(response));
              subscriber.onSubscribe();
            });
          },
          requestStream({ data, metadata }: { data: any; metadata: any }) {
            return new Flowable((subscriber: any) => {
              let intervalId: any;
              subscriber.onSubscribe({
                cancel: () => {
                  intervalId && clearInterval(intervalId);
                },
                request: (_: number) => {
                  intervalId = requestStreamHandler({ subscriber, data, metadata });
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
        port,
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
      }, 100);
    });
  }
}
