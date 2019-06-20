const path = require('path');
const baseConfig = require('../../webpack.config');

module.exports = (env) => ({
  ...baseConfig(env),
  entry: {
    'services/serviceA': './src/services/serviceA.ts',
    'services/serviceB': './src/services/serviceB.ts',
    'widgets/Grid': './src/widgets/Grid.tsx',
    'widgets/RequestForm': './src/widgets/RequestForm.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
});
