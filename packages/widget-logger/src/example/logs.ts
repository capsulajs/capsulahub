interface LogFixture {
  correlationId: string;
  type: 'request' | 'response';
  serviceName: string;
  methodName: string;
  content: string;
  delay: number;
}

export default [
  {
    delay: 500,
    correlationId: 'Adele',
    type: 'request',
    serviceName: 'AdeleService',
    methodName: 'hello$',
    content: "Hello, it's me",
  },
  {
    delay: 1000,
    correlationId: 'Adele',
    type: 'request',
    serviceName: 'AdeleService',
    methodName: 'hello$',
    content: "I was wondering if after all these years you'd like to meet",
  },
  {
    delay: 1500,
    correlationId: 'Adele',
    type: 'request',
    serviceName: 'AdeleService',
    methodName: 'hello$',
    content: "They say that time's supposed to heal ya, but I ain't done much healing",
  },
  {
    delay: 2000,
    correlationId: 'Adele',
    type: 'request',
    serviceName: 'AdeleService',
    methodName: 'hello$',
    content: 'Hello, can you hear me?',
  },
  {
    delay: 2500,
    correlationId: 'Support',
    type: 'response',
    serviceName: 'PhoneService',
    methodName: 'goodbye$',
    content: 'No',
  },
] as LogFixture[];
