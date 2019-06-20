import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import * as utils from '../../src/helpers/utils';
import { API } from '../../src';

const utilsToMock: any = utils;

export const mockConfigurationService = (configurationServiceMock: {
  entries: () => Promise<{ entries: Entity[] } | never>;
}) => {
  utilsToMock.getConfigurationService = jest.fn(() => {
    return configurationServiceMock;
  });
};

export const mockGetModuleDynamically = (modulePromises: Array<Promise<API.ModuleBootstrap<object | void>>>): void => {
  const getModuleDynamicallyMock = jest.fn();
  modulePromises.forEach((modulePromise) => {
    getModuleDynamicallyMock.mockReturnValueOnce(modulePromise);
  });

  utilsToMock.dynamicImport = getModuleDynamicallyMock;
};

export const mockBootstrapComponent = (throwsError = false): void => {
  utilsToMock.bootstrapComponent = jest.fn(() => {
    if (throwsError) {
      throw new Error('Error while defining custom element');
    }
    return {};
  });
};
