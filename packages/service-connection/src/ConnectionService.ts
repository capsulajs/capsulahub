import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import { API } from '.';
import { messages, providers } from './consts';
import WebSocketConnection from './providers/WebSocketConnection';
import RSocketConnection from './providers/RSocketConnection';
import { isNonEmptyString } from './helpers/validators';

export default (workspace: WORKSPACE_API.Workspace, serviceConfig: API.ConnectionConfig) => {
  return new Promise((resolve, reject) => {
    if (typeof serviceConfig !== 'object' || !serviceConfig) {
      return reject(new Error(messages.noProvider));
    }
    const { provider, serviceName } = serviceConfig;
    let connectionService: API.Connection;
    switch (provider) {
      case providers.websocket:
        connectionService = new WebSocketConnection();
        break;
      case providers.rsocket:
        connectionService = new RSocketConnection();
        break;
      default:
        const message = provider ? messages.wrongProvider : messages.noProvider;
        return reject(new Error(message));
    }

    if (!isNonEmptyString(serviceName)) {
      return reject(new Error(messages.noServiceName));
    }

    workspace.registerService({
      serviceName: serviceConfig.serviceName,
      reference: connectionService,
    });

    return resolve();
  });
};
