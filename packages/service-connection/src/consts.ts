export const messages = {
  noProvider: 'The provider has not been specified.',
  wrongProvider: 'The provider you tried to use is not supported.',
  invalidRequest: 'The request you provided is not correct.',
  noConnection: (envKey: string) => `${envKey} is not connected.`,
  pendingDisconnection: (envKey: string) => `${envKey} is already disconnecting, please wait.`,
};
