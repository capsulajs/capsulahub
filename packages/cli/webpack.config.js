const path = require('path');
const baseConfig = require('../../webpack.config');

module.exports = (env) => ({
  ...baseConfig(env),
  entry: {
    'services/serviceA': './cypress/support/cdn-emulator/services/serviceA.ts',
    'services/serviceB': './cypress/support/cdn-emulator/services/serviceB.ts',
    'widgets/Grid': './cypress/support/cdn-emulator/widgets/Grid.tsx',
    'widgets/RequestForm': './cypress/support/cdn-emulator/widgets/RequestForm.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'cdn-emulator'),
  },
});
