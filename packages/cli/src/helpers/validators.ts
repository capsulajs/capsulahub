import { args as constants } from './const';

export const argsValidator = (args: { token: string; configProvider?: string; port?: number; output?: string }) => {
  const validator = { isValid: true, error: '' };
  if (!args.token) {
    validator.isValid = false;
    validator.error = `${constants.token.error}`;
  }
  const configProviders = ['localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'];
  if (args.configProvider && !configProviders.includes(args.configProvider)) {
    validator.isValid = false;
    validator.error =
      validator.error === ''
        ? `${constants.configProvider.error}`
        : `${validator.error}\n${constants.configProvider.error}`;
  }
  if (args.port && (!Number.isInteger(Number(args.port)) || Number(args.port) < 1 || Number(args.port) > 65535)) {
    validator.isValid = false;
    validator.error =
      validator.error === '' ? `${constants.port.error}` : `${validator.error}\n${constants.port.error}`;
  }
  if (args.output === '') {
    validator.isValid = false;
    validator.error =
      validator.error === '' ? `${constants.output.error}` : `${validator.error}\n${constants.output.error}`;
  }
  return validator;
};
