import { args as constants } from '../../src/helpers/const';

export const argsValidator = (args: { token: string; configProvider?: string; port?: number }) => {
  const validator = { isValid: true, error: '' };
  if (!args.token) {
    validator.isValid = false;
    validator.error = `${constants.token.error}`;
  }
  const configProviders = ['localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'];
  if (args.configProvider && !configProviders.includes(args.configProvider)) {
    validator.isValid = false;
    validator.error = `\n${constants.configProvider.error}`;
  }
  if (args.port && (!Number.isInteger(args.port) || args.port < 1 || args.port > 65535)) {
    validator.isValid = false;
    validator.error = `\n${constants.port.error}`;
  }
  return validator;
};
