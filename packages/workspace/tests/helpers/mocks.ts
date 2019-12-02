import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import * as utils from '../../src/helpers/utils';
import { API } from '../../src';

const utilsToMock: any = utils;

export const mockConfigurationService = (configurationServiceMock: {
  entries: (entriesRequest?: { repository: string }) => Promise<{ entries: Entity[] } | never>;
}) => {
  const stub = jest.fn(() => {
    return configurationServiceMock;
  });
  utilsToMock.getConfigurationService = stub;
  return stub;
};

export const mockGetModuleDynamically = (modulePromises: Array<Promise<API.ModuleBootstrap<object | void>>>): void => {
  const getModuleDynamicallyMock = jest.fn();
  modulePromises.forEach((modulePromise) => {
    getModuleDynamicallyMock.mockReturnValueOnce(modulePromise);
  });

  utilsToMock.dynamicImport = getModuleDynamicallyMock;
};

export const mockInitComponent = ({ timesToFailWithError = 0, error = new Error() } = {}): void => {
  let failedWithErrorCount = 0;
  utilsToMock.initComponent = jest.fn(() => {
    if (failedWithErrorCount < timesToFailWithError) {
      failedWithErrorCount++;
      throw error;
    }
    return {};
  });
};
