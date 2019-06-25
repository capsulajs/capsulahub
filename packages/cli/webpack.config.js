const path = require('path');
const baseConfig = require('../../webpack.config');

module.exports = (env) => ({
  ...baseConfig(env),
  entry: {
    'port-1111/services/serviceA': './cypress/support/cdn-emulator/port-1111/services/serviceA.ts',
    'port-1111/services/serviceB': './cypress/support/cdn-emulator/port-1111/services/serviceB.ts',
    'port-1111/widgets/Grid': './cypress/support/cdn-emulator/port-1111/widgets/Grid.tsx',
    'port-1111/widgets/RequestForm': './cypress/support/cdn-emulator/port-1111/widgets/RequestForm.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'cdn-emulator'),
  },
});
