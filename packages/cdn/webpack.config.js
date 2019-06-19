const path = require('path');
const baseConfig = require('../../webpack.config');

module.exports = (env) => ({
  ...baseConfig(env),
  entry: {
    'services/serviceA': './src/services/serviceA.ts',
    'services/serviceB': './src/services/serviceB.ts',
    'components/Grid': './src/components/Grid.tsx',
    'components/RequestForm': './src/components/RequestForm.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
});
