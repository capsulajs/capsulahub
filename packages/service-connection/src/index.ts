import bootstrap from './ConnectionService';
import { API } from './api';
import RSocketConnection from './providers/RSocketConnection'
import WebSocketConnection from './providers/WebSocketConnection'

declare let publicExports: object;

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export { RSocketConnection };
export { WebSocketConnection };
export default bootstrap;
