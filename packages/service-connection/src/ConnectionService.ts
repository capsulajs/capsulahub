import { API } from '@capsulajs/capsulahub-workspace';
import { Connection, ConnectionConfig } from './api';
import { messages } from './consts';

export default (workspace: API.Workspace, serviceConfig: ConnectionConfig) => {
  return new Promise((resolve, reject) => {
    const { provider } = serviceConfig;

    let connectionService: Connection;

    switch (provider) {
      case 'websocket':
        connectionService = new WebSocketConnectionService(provider);
        break;
      case 'rsocket':
        connectionService = new RSocketConnectionService(provider);
        break;
      default:
        const message = provider ? messages.wrongProvider : messages.noProvider;
        reject(new Error(message));
    }

    workspace.registerService({
      serviceName: 'ConnectionService',
      reference: connectionService,
    });

    resolve();
  });
};
