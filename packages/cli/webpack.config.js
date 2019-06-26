const path = require('path');
const baseConfig = require('../../webpack.config');

module.exports = (env) => ({
  ...baseConfig(env),
  entry: {
    'services/serviceA': './cypress/support/cdn-emulator/services/serviceA.ts',
    'services/serviceFlows': './cypress/support/cdn-emulator/services/serviceFlows.ts',
    'widgets/Grid': './cypress/support/cdn-emulator/widgets/Grid.tsx',
    'widgets/ComponentA': './cypress/support/cdn-emulator/widgets/ComponentA.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'cdn-emulator'),
  },
});
