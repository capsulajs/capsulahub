// import { Connection as ConnectionInterface, ConnectionEvent } from '../../src/api';
// import { defaultRequests, eventTypes, providers } from '../consts';
// import { messages } from '../../src/consts';
// import WebSocketConnection from '../../src/providers/WebSocketConnection';
//
// describe.each(providers)('ConnectionService (%s) close method test suite', (provider) => {
//   let connection: ConnectionInterface;
//   const { envKey, endpoint } = defaultRequests[provider];
//
//   beforeEach(() => {
//     switch (provider) {
//       case 'websocket':
//         connection = new WebSocketConnection();
//         break;
//       case 'rsocket':
//         // connection = new RSocketConnection();
//         break;
//       default:
//         return new Error(messages.noProvider);
//     }
//   });
//
//   it('Calling close with a valid request', async () => {
//     expect.assertions(5);
//     let count = 0;
//     connection.events$({}).subscribe((event: ConnectionEvent) => {
//       switch (count) {
//         case 0:
//           expect(event.type).toBe(eventTypes.connectionStarted);
//           break;
//         case 1:
//           expect(event.type).toBe(eventTypes.connectionCompleted);
//           break;
//         case 2:
//           expect(event.type).toBe(eventTypes.disconnectionStarted);
//           break;
//         case 3:
//           expect(event.type).toBe(eventTypes.disconnectionCompleted);
//           break;
//       }
//       count = count + 1;
//     });
//     await connection.open({ envKey, endpoint });
//     connection.close({ envKey }).then(() => {
//       expect(connection.isConnectionOpened({ envKey })).toBeFalsy();
//     });
//   });
//
//   const invalidRequests = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];
//
//   it.each(invalidRequests)('Calling close with an invalid request: %s', async (invalidRequest) => {
//     expect.assertions(1);
//     await connection.open({ envKey, endpoint });
//     // @ts-ignore
//     return expect(connection.close(invalidRequest)).rejects.toBe(new Error(messages.invalidRequest));
//   });
//
//   it('Calling close when no connection has been currently established', async () => {
//     expect.assertions(1);
//     return expect(connection.close({ envKey })).rejects.toBe(new Error(messages.noConnection(envKey)));
//   });
//
//   it('Calling close when there is a "pending closing of connection"', async () => {
//     expect.assertions(1);
//     connection.events$({}).subscribe((event: ConnectionEvent) => {
//       if (event.type === eventTypes.disconnectionStarted) {
//         return expect(connection.close({ envKey })).rejects.toBe(new Error(messages.pendingDisconnection(envKey)));
//       }
//     });
//     await connection.open({ envKey, endpoint });
//     return expect(connection.close({ envKey })).resolves;
//   });
// });
