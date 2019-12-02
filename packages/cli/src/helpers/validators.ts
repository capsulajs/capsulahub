import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { args as constants } from './const';
import { Arguments } from './types';

export const argsValidator = (args: Arguments) => {
  const validator = { isValid: true, error: '' };
  if (!args.token || !args.token.trim()) {
    validator.isValid = false;
    validator.error = `${constants.token.error}`;
  }
  const configProviders = ['localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'];

  if (typeof args.configProvider !== 'undefined' && !configProviders.includes(args.configProvider)) {
    validator.isValid = false;
    validator.error =
      validator.error === ''
        ? `${constants.configProvider.error}`
        : `${validator.error}\n${constants.configProvider.error}`;
  }
  if (
    typeof args.port !== 'undefined' &&
    (!Number.isInteger(Number(args.port)) || Number(args.port) < 1 || Number(args.port) > 65535)
  ) {
    validator.isValid = false;
    validator.error =
      validator.error === '' ? `${constants.port.error}` : `${validator.error}\n${constants.port.error}`;
  }
  if (typeof args.output !== 'undefined' && args.output.trim() === '') {
    validator.isValid = false;
    validator.error =
      validator.error === '' ? `${constants.output.error}` : `${validator.error}\n${constants.output.error}`;
  }
  if (args.configProvider === configurationTypes.scalecube && (!args.dispatcherUrl || !args.dispatcherUrl.trim())) {
    validator.isValid = false;
    validator.error =
      validator.error === ''
        ? `${constants.dispatcherUrl.error}`
        : `${validator.error}\n${constants.dispatcherUrl.error}`;
  }
  return validator;
};
