export const args = {
  token: {
    title: 'token',
    description: 'The token that will be used to get the configuration (required)',
    error: 'Token is required',
  },
  configProvider: {
    title: 'configProvider',
    description:
      "The type of configuration provider (optional - default is \"httpFile\"). Possible options: 'localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'",
    error:
      'Wrong configuration provider (should be one of the following: localFile, httpFile, scalecube, httpServer, localStorage)',
  },
  port: {
    title: 'port',
    description:
      'The port on which the application will run locally (for instance, http://localhost:55555/) (optional - default is "55555")',
    error: 'Port must be a number included between 1 and 65535',
  },
  dispatcherUrl: {
    title: 'dispatcherUrl',
    description: 'The url of the dispatcher for those providers that use dispatcher (optional)',
  },
  output: {
    title: 'output',
    description: 'Relative path to the output folder (optional - default is "./dist")',
    error: "Output directory name couldn't be empty",
  },
};
