export default interface LogEvent {
  timestamp: number;
  correlationId: string;
  type: 'request' | 'response';
  serviceName: string;
  methodName: string;
  data: object;
}
