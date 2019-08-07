import { Api } from '@scalecube/scalecube-microservice';
import { API } from '../../src';

interface ConfigEntriesParts {
  services: API.ServiceConfig[];
  layoutComponents: Record<string, API.ComponentConfig>;
  itemComponents: Record<string, API.ComponentConfig>;
}

interface ServicesConfigEntry {
  key: 'services';
  value: API.ServiceConfig[];
}

export const serviceAConfig = {
  serviceName: 'ServiceA',
  path: 'http://localhost:3000/services/serviceA.js',
  definition: {
    serviceName: 'ServiceA',
    methods: {
      greet: { asyncModel: 'requestResponse' as Api.AsyncModel },
    },
  },
  config: { name: 'serviceA', message: 'what pill would you choose: red or blue?' },
};

export const serviceBConfig = {
  serviceName: 'ServiceB',
  path: 'http://localhost:3000/services/serviceB',
  definition: {
    serviceName: 'ServiceB',
    methods: {
      getRandomNumbers: { asyncModel: 'requestStream' as Api.AsyncModel },
    },
  },
  config: { name: 'serviceB' },
};

export const serviceCConfig = {
  serviceName: 'ServiceC',
  path: 'http://localhost:3000/services/serviceC.js',
  definition: {
    serviceName: 'ServiceC',
    methods: {
      hello: { asyncModel: 'requestResponse' as Api.AsyncModel },
    },
  },
  config: {},
};

export const serviceDConfig = {
  serviceName: 'ServiceD',
  path: 'http://localhost:3000/services/serviceD.js',
  definition: {
    serviceName: 'ServiceD',
    methods: {
      hello: { asyncModel: 'requestResponse' as Api.AsyncModel },
      world: { asyncModel: 'requestResponse' as Api.AsyncModel },
    },
  },
  config: {},
};

export const serviceEConfig = {
  serviceName: 'ServiceE',
  path: 'http://localhost:3000/services/serviceE.js',
  definition: {
    serviceName: 'ServiceE',
    methods: {
      testServiceE: { asyncModel: 'requestResponse' as Api.AsyncModel },
    },
  },
  config: {},
};

export const serviceGConfig = {
  serviceName: 'ServiceG',
  definition: {
    serviceName: 'ServiceG',
    methods: {
      testServiceG: { asyncModel: 'requestResponse' as Api.AsyncModel },
    },
  },
  config: {},
};

export const baseLayoutComponentsConfig = {
  grid: {
    componentName: 'web-grid',
    nodeId: 'root',
    path: 'http://localhost:3000/components/Grid',
    config: { title: 'Base Grid' },
  },
};

export const baseItemComponentsConfig = {
  ['request-form']: {
    componentName: 'web-request-form',
    nodeId: 'request-form',
    path: 'http://localhost:3000/components/RequestForm',
    config: { title: 'Base Request Form' },
  },
};

export const getConfigEntries = ({
  services = [serviceAConfig, serviceBConfig],
  layoutComponents = baseLayoutComponentsConfig,
  itemComponents = baseItemComponentsConfig,
}: Partial<ConfigEntriesParts> = {}) => {
  return [
    {
      key: 'name',
      value: 'baseWorkspace',
    },
    {
      key: 'services',
      value: services,
    },
    {
      key: 'components',
      value: {
        layouts: layoutComponents,
        items: itemComponents,
      },
    },
  ];
};

const baseConfigEntries = getConfigEntries();

export const configEntriesWithUnregisteredService = getConfigEntries({
  services: [...(baseConfigEntries[1] as ServicesConfigEntry).value, serviceCConfig],
});

export const configEntriesWithIncorrectDefinitionService = getConfigEntries({
  services: [...(baseConfigEntries[1] as ServicesConfigEntry).value, serviceDConfig],
});

export const configEntriesWithServicesEG = getConfigEntries({ services: [serviceEConfig, serviceGConfig] });

export default baseConfigEntries;
