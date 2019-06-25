export const args = {
  token: {
    title: 'token',
    description: 'The token that will be used to get the configuration (required)',
  },
  configProvider: {
    title: 'configProvider',
    description:
      "The type of configuration provider (optional - default is \"httpFile\"). Possible options: 'localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'",
  },
  port: {
    title: 'port',
    description:
      'The port on which the application will run locally (for instance, http://localhost:55555/) (optional - default is "55555")',
  },
  dispatcherUrl: {
    title: 'dispatcherUrl',
    description: 'The url of the dispatcher for those providers that use dispatcher (optional)',
  },
};

export const messages = {
  appIsPending: 'Starting Capsulahub application...',
  appIsBundled: 'Capsulahub application has been bundled successfully',
  getAppIsReady: (port: number) => `Capsulahub application is ready to be used on http://localhost:${port}`,
  appHasBundleError: 'Error while bundling Capsulahub application',
  getAppTempFilesAreNotDeletedError: (tempPath: string) =>
    `Temporary Capsulahub files were not deleted from ${tempPath}`,
};
