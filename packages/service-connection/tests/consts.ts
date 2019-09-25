export const providers = ['rsocket'];
// export const providers = ['websocket'];
// export const providers = ['websocket', 'rsocket'];

const endpoints = {
  websocket: 'wss://echo.websocket.org',
  rsocket: 'wss://configuration-service-staging-rs.genesis.om2.com',
};

export const defaultRequests: { [key: string]: any } = {
  websocket: { envKey: 'develop', endpoint: endpoints.websocket, data: {} },
  rsocket: {
    envKey: 'develop',
    endpoint: endpoints.rsocket,
    data: {
      q: '/configuration/readList',
      sid: 1,
      d: {
        apiKey:
          'eyJraWQiOiI5OGU4Mjg3MC1iYTVjLTRkNmUtYjJmZC00YWIxNWQ1NDE1MWQiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJPUkctQTY0OEM0NUYxQTdFNkE3NUU1Q0EiLCJpYXQiOjE1NjY0NjMxMDAsInN1YiI6Ik9SRy1BNjQ4QzQ1RjFBN0U2QTc1RTVDQSIsImlzcyI6InNjYWxlY3ViZS5pbyIsImF1ZCI6Ik9SRy1BNjQ4QzQ1RjFBN0U2QTc1RTVDQSIsInJvbGUiOiJNZW1iZXIifQ.LynHLSd-tN6QPuXx0F6Ul11HcTl0KVSd0Y-f6USDTKVNcgdB3VqVunWTL4J2M4bFyCUITuhxuZSDjCPZKhRL1_yPL8HIQ55LJAIBCxW2bwwjRpmbveQkKqz_GVsUi-EZzmG_oKlpiEG3M3zaXdYZF2QBooHZIKBuCiKq5qIc7eCydJCCiKi3WRwlTpAX8NFOZkbphWEhGF45AiGdDZw55jAojf8cOH2TMuxBvWWucEJ1kmxbAaERvXGl6nfhPhTL7oD0Oorn-74iYVt8p1MHaFAtQ4fO9BmjuM5D4jn23ZRECKjybkP-rbjNogou9QpuAjaY-3AYHXkfQfdnnzgfEA',
        repository: 'EnvData',
      },
    },
  },
};

export const rsocketModels = {
  response: 'request/response',
  stream: 'request/stream',
};

export const eventTypes = {
  connectionStarted: 'connecting',
  connectionCompleted: 'connected',
  disconnectionStarted: 'disconnecting',
  disconnectionCompleted: 'disconnected',
  error: 'error',
  messageSent: 'messageSent',
  messageReceived: 'messageReceived',
};
