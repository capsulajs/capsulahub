const baseConfig = require('../../webpack.config');

module.exports = (env) => ({
  ...baseConfig(env),
});
