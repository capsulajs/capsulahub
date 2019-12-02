import bootstrap from '../../src';
import { Auth } from '../../src/AuthService';
import { baseInvalidValues } from '../helpers/consts';
import { errors } from '../../src/helpers/consts';
import { mockLock } from '../helpers/utils';

describe('AuthService bootstrap test suite', () => {
  it(
    'AuthService extension bootstrap function resolves correctly and triggers the registration of an instance of' +
      ' AuthService in Workspace',
    async () => {
      expect.assertions(2);
      const serviceName = 'AuthService';
      const registerServiceMock = jest.fn();
      const workspace = { registerService: registerServiceMock };
      const config = { domain: 'domain', clientId: 'clientId', serviceName };
      // @ts-ignore
      await bootstrap(workspace, config);
      registerServiceMock.mockResolvedValueOnce({});
      expect(registerServiceMock.mock.calls[0][0].serviceName).toBe(serviceName);
      expect(registerServiceMock.mock.calls[0][0].reference).toBeInstanceOf(Auth);
    }
  );

  it.each([...baseInvalidValues])(
    'AuthService extension bootstrap function rejects with an' +
      ' error if "serviceName" is invalid or is not in configuration: %s',
    (invalidServiceName) => {
      expect.assertions(1);
      const workspace = { registerService: () => Promise.resolve() };
      const config = { domain: 'domain', clientId: 'clientId', serviceName: invalidServiceName };
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(errors.invalidServiceName));
      });
    }
  );

  it.each([...baseInvalidValues])(
    'AuthService extension bootstrap function rejects with an' +
      ' error if "domain" is invalid or is not in configuration: %s',
    (invalidDomain) => {
      expect.assertions(1);
      const workspace = { registerService: () => Promise.resolve() };
      const config = { domain: invalidDomain, clientId: 'clientId', serviceName: 'AuthService' };
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(errors.invalidDomain));
      });
    }
  );

  it.each([...baseInvalidValues])(
    'AuthService extension bootstrap function rejects with an' +
      ' error if "clientId" is invalid or is not in configuration: %s',
    (invalidClientId) => {
      expect.assertions(1);
      const workspace = { registerService: () => Promise.resolve() };
      const config = { domain: 'domain', clientId: invalidClientId, serviceName: 'AuthService' };
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(errors.invalidClientId));
      });
    }
  );

  it.each(['', ' ', 'test', 555, false, true, null, [], ['test']])(
    'AuthService extension bootstrap function rejects with an' +
      ' error if "lockOptions" is invalid or is not in configuration: %s',
    (invalidLockOptions) => {
      expect.assertions(1);
      const workspace = { registerService: () => Promise.resolve() };
      const config = {
        domain: 'domain',
        clientId: 'clientId',
        serviceName: 'AuthService',
        lockOptions: invalidLockOptions,
      };
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(errors.invalidLockOptions));
      });
    }
  );

  it('Bootstrap promise is rejected with an error if an error occurs while the creation of AuthService instance', () => {
    expect.assertions(2);
    const serviceName = 'AuthService';
    const registerServiceMock = jest.fn();
    const workspace = { registerService: registerServiceMock };
    const config = { domain: 'domain', clientId: 'clientId', serviceName };
    mockLock({ isInitializationError: true });
    // @ts-ignore
    return expect(bootstrap(workspace, config))
      .rejects.toEqual(new Error('Error from Auth0Lock'))
      .then(() => expect(registerServiceMock).toBeCalledTimes(0));
  });
});
