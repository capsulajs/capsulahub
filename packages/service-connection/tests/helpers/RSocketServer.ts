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

type RequestResponseHandler = (request: { subscriber: any; data: any; metadata: any }) => void;

type RequestStreamHandler = (request: { subscriber: any; data: any; metadata: any }) => any;

export interface IRSocketServerOptions {
  port?: number;
  requestResponseHandler?: RequestResponseHandler;
  requestStreamHandler?: RequestStreamHandler;
}

const defaultRequestResponseHandler: RequestResponseHandler = ({ subscriber, data }) => {
  setTimeout(() => {
    switch (data.qualifier) {
      case '/greeting': {
        if (!data.data.name) {
          subscriber.onError(new Error('Server error: "name" should be provided for "/greeting"'));
        } else {
          subscriber.onComplete({ data: { data: { hello: `Greetings to ${data.data.name}!` } } });
        }
        break;
      }
    }
  }, 100);
};

const defaultRequestStreamHandler: RequestStreamHandler = ({ data, subscriber }) => {
  if (data.qualifier === '/timer') {
    if (!data.data.count) {
      return subscriber.onError(new Error('Server error: "count" should be provided for "/timer"'));
    }
    let currentCount = 0;
    let countLeft = data.data.count;
    const intervalId = setInterval(() => {
      if (!countLeft) {
        clearInterval(intervalId);
      } else {
        subscriber.onNext({ data: { data: { currentCount: ++currentCount, countLeft: --countLeft } } });
      }
    }, 200);
    return intervalId;
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
              requestResponseHandler({ subscriber, data, metadata });
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
      }, 2000);
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
