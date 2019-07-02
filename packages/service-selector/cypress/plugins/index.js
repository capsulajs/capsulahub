const wp = require('@cypress/webpack-preprocessor');

module.exports = (on) => {
  const options = {
    webpackOptions: require('../../webpack.config')({ production: 'false' }),
  };
  on('file:preprocessor', wp(options));
};
