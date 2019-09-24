import { API } from '@capsulajs/capsulahub-workspace';
import { Connection, ConnectionConfig } from './api';
import { messages } from './consts';
import WebSocketConnection from './providers/WebSocketConnection';
import RSocketConnection from './providers/RSocketConnection';

export default (workspace: API.Workspace, serviceConfig: ConnectionConfig) => {
  return new Promise((resolve, reject) => {
    const { provider } = serviceConfig;

    let connectionService: Connection | undefined;

    switch (provider) {
      case 'websocket':
        connectionService = new WebSocketConnection();
        break;
      case 'rsocket':
        connectionService = new RSocketConnection();
        break;
      default:
        connectionService = undefined;
        const message = provider ? messages.wrongProvider : messages.noProvider;
        reject(new Error(message));
    }

    workspace.registerService({
      serviceName: serviceConfig.serviceName,
      reference: connectionService,
    });

    resolve();
  });
};
