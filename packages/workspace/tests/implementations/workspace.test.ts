import { take } from 'rxjs/operators';
import * as configurationServiceItems from '@capsulajs/capsulajs-configuration-service';
// @ts-ignore
import serviceABootstrap from '@capsulajs/capsulahub-cdn-emulator/src/services/serviceA';
// @ts-ignore
import serviceBRegistersABootstrap from '@capsulajs/capsulahub-cdn-emulator/src/services/serviceBRegistersA';
// @ts-ignore
import serviceBBootstrap from '@capsulajs/capsulahub-cdn-emulator/src/services/serviceB';
// @ts-ignore
import serviceCBootstrap, { ServiceC } from '@capsulajs/capsulahub-cdn-emulator/src/services/serviceC';
// @ts-ignore
import serviceDBootstrap from '@capsulajs/capsulahub-cdn-emulator/src/services/serviceD';
// @ts-ignore
import gridComponentBootstrap from '@capsulajs/capsulahub-cdn-emulator/src/widgets/Grid';
// // @ts-ignore
import requestFormComponentBootstrap from '@capsulajs/capsulahub-cdn-emulator/src/widgets/RequestForm';
import WorkspaceFactory from '../../src/WorkspaceFactory';
import { API } from '../..';
import {
  configDefaultRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
  getBootstrapComponentError,
  getInitComponentError,
  getLoadingServiceError,
  getLoadingComponentError,
  invalidRegisterServiceRequestError,
  serviceAlreadyRegisteredError,
  serviceToRegisterMissingInConfigurationError,
  getBootstrapServiceError,
  getScalecubeCreationError,
  configNotLoadedError,
  createWorkspaceWrongRequestForScalecubeProviderError,
} from '../../src/helpers/const';
import { mockInitComponent, mockConfigurationService, mockGetModuleDynamically } from '../helpers/mocks';
import baseConfigEntries, {
  serviceAConfig,
  serviceAWithNoPathConfig,
  serviceBConfig,
  serviceCConfig,
  getConfigEntries,
  configEntriesWithIncorrectDefinitionService,
  configEntriesWithUnregisteredService,
} from '../helpers/baseConfigEntries';
import { applyPostMessagePolyfill } from '../helpers/polyfills/PostMessageWithTransferPolyfill';
import { applyMessageChannelPolyfill } from '../helpers/polyfills/MessageChannelPolyfill';
import { importError, bootstrapError, serviceInWorkspaceKeys } from '../helpers/const';
import { testPendingPromise } from '../helpers/utils';

const repositoryNotFoundError = `Configuration repository ${configDefaultRepositoryName} not found`;

describe('Workspace tests', () => {
  applyPostMessagePolyfill();
  applyMessageChannelPolyfill();
  const getConfigurationServiceClassSpy = jest.spyOn(configurationServiceItems, 'getProvider');

  beforeEach(() => {
    getConfigurationServiceClassSpy.mockClear();
  });

  it('Call createWorkspace with a token with no configuration available is rejected with error', () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.reject(new Error(repositoryNotFoundError)),
    };
    mockConfigurationService(configurationServiceMock);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(repositoryNotFoundError)
    );
  });

  it('Call createWorkspace with a token with invalid configuration is rejected with error', () => {
    expect.assertions(1);
    const invalidConfigEntries = [{ key: 'name', value: 'workspaceConfig' }, { key: 'services', value: [] }];
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: invalidConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(configWrongFormatError)
    );
  });

  const invalidCreateWorkspaceRequest = [' ', {}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1];

  test.each(invalidCreateWorkspaceRequest)(
    'Call createWorkspace with a token with invalid format is rejected with error (%s)',
    (invalidToken) => {
      expect.assertions(1);
      const workspaceFactory = new WorkspaceFactory();
      // @ts-ignore
      return expect(workspaceFactory.createWorkspace({ token: invalidToken })).rejects.toEqual(
        new Error(createWorkspaceWrongRequestError)
      );
    }
  );

  const invalidConfigurationTypes = [' ', {}, { test: 'test' }, [], ['test'], null, true, false, 0, -1];
  test.each(invalidConfigurationTypes)(
    'Call createWorkspace with an invalid configProvider is rejected with error (%s)',
    (invalidConfigProvider) => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: baseConfigEntries }),
      };
      mockConfigurationService(configurationServiceMock);
      const workspaceFactory = new WorkspaceFactory();
      const errorMessageFromConfigurationService = invalidConfigProvider
        ? configurationServiceItems.messages.configProviderDoesNotExist
        : configurationServiceItems.messages.getProviderInvalidRequest;
      return expect(
        // @ts-ignore
        workspaceFactory.createWorkspace({ token: '123', configProvider: invalidConfigProvider })
      ).rejects.toEqual(new Error(configNotLoadedError(new Error(errorMessageFromConfigurationService))));
    }
  );

  it('Call createWorkspace when a Workspace is created creates new instance of Workspace', async (done) => {
    expect.assertions(2);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: configEntriesWithUnregisteredService }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceCBootstrap),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceCBootstrap),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace1 = await workspaceFactory.createWorkspace({ token: '123' });

    const workspace2 = await workspaceFactory.createWorkspace({ token: '123' });

    const servicesForWorkspace1 = await workspace1.services({});
    const servicesForWorkspace2 = await workspace2.services({});

    let unregisteredServiceFromWorkspace1Received = false;
    let unregisteredServiceFromWorkspace2Received = false;

    servicesForWorkspace1.ServiceC.then(() => {
      unregisteredServiceFromWorkspace1Received = true;
    });
    servicesForWorkspace2.ServiceC.then(() => {
      unregisteredServiceFromWorkspace2Received = true;
    });

    await workspace2.registerService({
      serviceName: serviceCConfig.serviceName,
      reference: new ServiceC(),
    });

    setTimeout(() => {
      expect(unregisteredServiceFromWorkspace1Received).toBeFalsy();
      expect(unregisteredServiceFromWorkspace2Received).toBeTruthy();
      done();
    }, 1000);
  });

  it('An error with importing a service occurs after calling createWorkspace', async () => {
    expect.assertions(3);
    const consoleErrorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => true);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.reject(importError),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const expectedErrorMessage = getLoadingServiceError('ServiceA');
    expect(consoleErrorSpy).toHaveBeenLastCalledWith(expectedErrorMessage, importError);
    const services = await workspace.services({});
    expect(typeof (await services.ServiceB).proxy.getRandomNumbers().subscribe === 'function').toBeTruthy();
    consoleErrorSpy.mockRestore();
    return testPendingPromise(services.ServiceA);
  });

  const testBootstrapServiceError = async (brokenBootstrap: () => Promise<any>) => {
    expect.assertions(3);
    const consoleErrorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => true);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(brokenBootstrap),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const expectedErrorMessage = getBootstrapServiceError('ServiceB');
    expect(consoleErrorSpy).toHaveBeenLastCalledWith(expectedErrorMessage, bootstrapError);
    const services = await workspace.services({});
    expect(typeof (await services.ServiceA).proxy.greet('Stephane').then === 'function').toBeTruthy();
    consoleErrorSpy.mockRestore();
    return testPendingPromise(services.ServiceB);
  };

  it('An error with bootstrapping a service occurs after calling createWorkspace (error in promise)', () => {
    return testBootstrapServiceError(() => {
      return new Promise(() => {
        throw bootstrapError;
      });
    });
  });

  it('An error with bootstrapping a service occurs after calling createWorkspace (error outside of promise)', () => {
    return testBootstrapServiceError(() => {
      throw bootstrapError;
    });
  });

  it('An error with importing a component occurs after calling createWorkspace', async () => {
    expect.assertions(3);
    const consoleErrorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => true);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.reject(importError),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const expectedErrorMessage = getLoadingComponentError('web-grid');
    expect(consoleErrorSpy).toHaveBeenLastCalledWith(expectedErrorMessage, importError);
    const components = await workspace.components({});
    const requestFormComponent = await components['request-form'];
    expect(!!requestFormComponent.reference && typeof requestFormComponent.reference === 'object').toBeTruthy();
    consoleErrorSpy.mockRestore();
    return testPendingPromise(components.grid);
  });

  interface ErrorTypesForComponentTest {
    bootstrap: 'bootstrap';
    init: 'init';
  }

  const errorTypesForComponentTest: ErrorTypesForComponentTest = {
    bootstrap: 'bootstrap',
    init: 'init',
  };

  const testBootstrapComponentError = async (
    errorType: keyof ErrorTypesForComponentTest,
    brokenBootstrap?: () => Promise<any>
  ) => {
    expect.assertions(3);
    const consoleErrorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => true);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(
        errorType === errorTypesForComponentTest.bootstrap
          ? brokenBootstrap!
          : (requestFormComponentBootstrap as API.ModuleBootstrap<object>)
      ),
    ]);
    mockInitComponent(
      errorType === errorTypesForComponentTest.init ? { timesToFailWithError: 1, error: bootstrapError } : {}
    );

    const gridComponentData = { rootId: 'grid', name: 'web-grid' };
    const requestFormComponentData = { rootId: 'request-form', name: 'web-request-form' };
    const successfulComponent =
      errorType === errorTypesForComponentTest.bootstrap ? gridComponentData : requestFormComponentData;
    const failedComponent =
      errorType === errorTypesForComponentTest.bootstrap ? requestFormComponentData : gridComponentData;

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const expectedErrorMessage =
      errorType === errorTypesForComponentTest.bootstrap
        ? getBootstrapComponentError(failedComponent.name)
        : getInitComponentError(failedComponent.name);
    expect(consoleErrorSpy).toHaveBeenLastCalledWith(expectedErrorMessage, bootstrapError);
    const components = await workspace.components({});
    const successfulComponentFromWorkspace = await components[successfulComponent.rootId];
    expect(
      !!successfulComponentFromWorkspace.reference && typeof successfulComponentFromWorkspace.reference === 'object'
    ).toBeTruthy();
    consoleErrorSpy.mockRestore();
    return testPendingPromise(components[failedComponent.rootId]);
  };

  it('An error with bootstrapping a component occurs after calling createWorkspace (error in promise)', () => {
    return testBootstrapComponentError(errorTypesForComponentTest.bootstrap, () => {
      return new Promise((_) => {
        throw bootstrapError;
      });
    });
  });

  it('An error with bootstrapping a component occurs after calling createWorkspace (error outside of promise)', () => {
    return testBootstrapComponentError(errorTypesForComponentTest.bootstrap, () => {
      throw bootstrapError;
    });
  });

  it('An error with registering a component occurs after calling createWorkspace', () => {
    return testBootstrapComponentError(errorTypesForComponentTest.init);
  });

  it('Call services method returns a map of promises to each service loaded in Workspace', async (done) => {
    expect.assertions(6);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const services = await workspace.services({});
    expect(Object.keys(services)).toEqual(['ServiceA', 'ServiceB']);

    const serviceA = await services.ServiceA;
    expect(serviceA.serviceName).toEqual('ServiceA');
    const greetRes = await serviceA.proxy.greet('Stephane');
    expect(greetRes).toEqual('Dear Stephane, what pill would you choose: red or blue?');
    const serviceB = await services.ServiceB;
    expect(serviceB.serviceName).toEqual('ServiceB');

    let updates = 0;
    serviceB.proxy
      .getRandomNumbers()
      .pipe(take(2))
      .subscribe((num: number) => {
        expect(typeof num === 'number').toBeTruthy();
        updates++;
        if (updates === 2) {
          done();
        }
      });
  });

  it('Call components method returns a map of promises to each component loaded in Workspace', async () => {
    expect.assertions(9);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const components = await workspace.components({});
    expect(Object.keys(components)).toEqual(['grid', 'request-form']);
    const gridComponentData = await components.grid;
    expect(gridComponentData.componentName).toEqual('web-grid');
    expect(gridComponentData.nodeId).toEqual('grid');
    // Jest limitation of using HTMLElement
    expect(gridComponentData.reference).toEqual({});
    expect(gridComponentData.type).toEqual('layout');

    const requestFormComponentData = await components['request-form'];
    expect(requestFormComponentData.componentName).toEqual('web-request-form');
    expect(requestFormComponentData.nodeId).toEqual('request-form');
    // Jest limitation of using HTMLElement
    expect(requestFormComponentData.reference).toEqual({});
    expect(requestFormComponentData.type).toEqual('item');
  });

  it('Call registerService method with a service already registered is rejected with error', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    return expect(
      workspace.registerService({
        serviceName: serviceAConfig.serviceName,
        reference: {},
      })
    ).rejects.toEqual(new Error(serviceAlreadyRegisteredError));
  });

  const invalidServiceNames = [' ', {}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1];
  test.each(invalidServiceNames)(
    'Call registerService method with an invalid serviceName is rejected with error',
    async (invalidServiceName) => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: baseConfigEntries }),
      };
      mockConfigurationService(configurationServiceMock);
      mockGetModuleDynamically([
        Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
        Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
      ]);
      mockInitComponent();

      const workspaceFactory = new WorkspaceFactory();
      const workspace = await workspaceFactory.createWorkspace({ token: '123' });
      return expect(
        workspace.registerService({
          // @ts-ignore
          serviceName: invalidServiceName,
          reference: {},
        })
      ).rejects.toEqual(new Error(invalidRegisterServiceRequestError));
    }
  );

  it("Call registerService method with a service that doesnt's exist in configuration is rejected with error", async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    return expect(
      workspace.registerService({
        serviceName: 'MissingService',
        reference: {},
      })
    ).rejects.toEqual(new Error(serviceToRegisterMissingInConfigurationError));
  });

  it('Call registerService method with invalid reference rejects servicePromise in ServicesMap', async (done) => {
    expect.assertions(2);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: configEntriesWithUnregisteredService }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceCBootstrap),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const services = await workspace.services({});

    services.ServiceC.catch((error) => {
      expect(error).toEqual(new Error(invalidRegisterServiceRequestError));
      done();
    });

    try {
      await workspace.registerService({
        serviceName: serviceCConfig.serviceName,
        reference: 'invalid reference',
      });
    } catch (error) {
      expect(error).toEqual(new Error(invalidRegisterServiceRequestError));
    }
  });

  it(
    'If scalecube error happens while registering a service, the promise for this service should be rejected with' +
      ' an error',
    async () => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: configEntriesWithIncorrectDefinitionService }),
      };
      mockConfigurationService(configurationServiceMock);
      mockGetModuleDynamically([
        Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(serviceDBootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
        Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
      ]);
      mockInitComponent();

      const workspaceFactory = new WorkspaceFactory();
      const workspace = await workspaceFactory.createWorkspace({ token: '123' });
      const services = await workspace.services({});
      try {
        await services.ServiceD;
      } catch (e) {
        return expect(e.message).toMatch(
          getScalecubeCreationError(
            new Error(''), // testing only capsula error message
            'ServiceD'
          )
        );
      }
    }
  );

  test.each`
    configProvider                                                    | configurationServiceClassName
    ${`${configurationServiceItems.configurationTypes.localStorage}`} | ${'ConfigurationServiceLocalStorage'}
    ${`${configurationServiceItems.configurationTypes.localFile}`}    | ${'ConfigurationServiceFile'}
    ${`${configurationServiceItems.configurationTypes.httpFile}`}     | ${'ConfigurationServiceHttpFile'}
    ${`${configurationServiceItems.configurationTypes.scalecube}`}    | ${'ConfigurationServiceScalecube'}
    ${`${configurationServiceItems.configurationTypes.httpServer}`}   | ${'ConfigurationServiceHttp'}
  `(
    'Workspace is created with the correct configurationType: $configurationType: $configurationServiceClassName',
    async ({ configProvider, configurationServiceClassName }) => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: baseConfigEntries }),
      };
      mockConfigurationService(configurationServiceMock);
      mockGetModuleDynamically([
        Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
        Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
        Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
      ]);
      mockInitComponent();
      const workspaceFactory = new WorkspaceFactory();
      const createWorkspaceRequest: API.CreateWorkspaceRequest = { token: '123', configProvider };
      if (configProvider === configurationServiceItems.configurationTypes.scalecube) {
        createWorkspaceRequest.dispatcherUrl = 'http://localhost:3000';
      }
      await workspaceFactory.createWorkspace(createWorkspaceRequest);
      return expect(getConfigurationServiceClassSpy.mock.results[0].value.name).toBe(configurationServiceClassName);
    }
  );

  it('Call createWorkspace without providing configurationType should create workspace with default type of configuration provider', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    await workspaceFactory.createWorkspace({ token: '123' });
    return expect(getConfigurationServiceClassSpy.mock.results[0].value.name).toBe('ConfigurationServiceHttpFile');
  });

  it('Call createWorkspace with providing non-existing configurationType is rejected with error', () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);

    const wrongConfigurationType = 'wrongConfigurationType';
    const workspaceFactory = new WorkspaceFactory();
    return expect(
      // @ts-ignore
      workspaceFactory.createWorkspace({ token: '123', configProvider: wrongConfigurationType })
    ).rejects.toEqual(
      new Error(configNotLoadedError(new Error(configurationServiceItems.messages.configProviderDoesNotExist)))
    );
  });

  it('DispatcherUrl is applied correctly while the creation of ConfigurationService', async () => {
    expect.assertions(2);

    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    const getConfigStub = mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    await workspaceFactory.createWorkspace({
      token: '123',
      configProvider: configurationServiceItems.configurationTypes.scalecube,
      dispatcherUrl: 'http://localhost:3000',
    });

    expect(getConfigStub).toHaveBeenCalledTimes(1);
    expect(getConfigStub).toHaveBeenCalledWith(
      '123',
      configurationServiceItems.ConfigurationServiceScalecube,
      'http://localhost:3000'
    );
  });

  test.each(invalidCreateWorkspaceRequest)(
    'Call createWorkspace for "scalecube" configProvider with a dispatcherUrl with invalid format is rejected with error (%s)',
    (invalidDispatcherUrl) => {
      expect.assertions(1);
      const workspaceFactory = new WorkspaceFactory();
      return expect(
        workspaceFactory.createWorkspace({
          token: '123',
          configProvider: configurationServiceItems.configurationTypes.scalecube,
          // @ts-ignore
          dispatcherUrl: invalidDispatcherUrl,
        })
      ).rejects.toEqual(new Error(createWorkspaceWrongRequestForScalecubeProviderError));
    }
  );

  it('Call services method when no path is provided (the service with no path has not been registered)', async () => {
    expect.assertions(2);

    const configurationServiceMock = {
      entries: () =>
        Promise.resolve({ entries: getConfigEntries({ services: [serviceAWithNoPathConfig, serviceBConfig] }) }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceBBootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const services = await workspace.services({});
    const serviceB = await services.ServiceB;
    expect(Object.keys(serviceB)).toEqual(serviceInWorkspaceKeys);
    return testPendingPromise(services.ServiceA);
  });

  it('Call services method when no path is provided (a service with no path is registered by another service)', async () => {
    expect.assertions(2);

    const configurationServiceMock = {
      entries: () =>
        Promise.resolve({ entries: getConfigEntries({ services: [serviceAWithNoPathConfig, serviceBConfig] }) }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceBRegistersABootstrap as API.ModuleBootstrap<void>),
      Promise.resolve(gridComponentBootstrap as API.ModuleBootstrap<object>),
      Promise.resolve(requestFormComponentBootstrap as API.ModuleBootstrap<object>),
    ]);
    mockInitComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const services = await workspace.services({});
    const [serviceA, serviceB] = await Promise.all([services.ServiceA, services.ServiceB]);
    expect(Object.keys(serviceA)).toEqual(serviceInWorkspaceKeys);
    expect(Object.keys(serviceB)).toEqual(serviceInWorkspaceKeys);
  });
});
