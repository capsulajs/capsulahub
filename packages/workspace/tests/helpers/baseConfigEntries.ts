import { Api } from '@scalecube/scalecube-microservice';

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

const baseConfigEntries = [
  {
    key: 'name',
    value: 'baseWorkspace',
  },
  {
    key: 'services',
    value: [
      serviceAConfig,
      {
        serviceName: 'ServiceB',
        path: 'http://localhost:3000/services/serviceB',
        definition: {
          serviceName: 'ServiceB',
          methods: {
            getRandomNumbers: { asyncModel: 'requestStream' },
          },
        },
        config: { name: 'serviceB' },
      },
    ],
  },
  {
    key: 'components',
    value: {
      layouts: {
        grid: {
          componentName: 'web-grid',
          nodeId: 'root',
          path: 'http://localhost:3000/components/Grid',
          config: { title: 'Base Grid' },
        },
      },
      items: {
        ['request-form']: {
          componentName: 'web-request-form',
          nodeId: 'request-form',
          path: 'http://localhost:3000/components/RequestForm',
          config: { title: 'Base Request Form' },
        },
      },
    },
  },
];

export const configEntriesWithUnregisteredService = [
  baseConfigEntries[0],
  {
    key: 'services',
    value: [...(baseConfigEntries[1] as any).value, serviceCConfig],
  },
  baseConfigEntries[2],
];

export const configEntriesWithIncorrectDefinitionService = [
  baseConfigEntries[0],
  {
    key: 'services',
    value: [...(baseConfigEntries[1] as any).value, serviceDConfig],
  },
  baseConfigEntries[2],
];

export default baseConfigEntries;
