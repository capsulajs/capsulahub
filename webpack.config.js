const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const packagePath = process.cwd();
  const plugins = [];
  const isProduction = env.production === 'true';
  if (isProduction) {
    // Production plugins
    plugins.push(
      new WrapperPlugin({
        test: /\.js$/,
        header: 'var publicExports = {}; (function () {\n',
        footer: '})();export default publicExports',
      })
    );
  } else {
    // Development plugins
    plugins.push(
      new HtmlWebpackPlugin({
        template: 'src/example/index.html',
      })
    );
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: isProduction ? `${packagePath}/src/index.ts` : `${packagePath}/src/example/index.ts`,
    output: {
      path: isProduction ? `${packagePath}/dist` : `${packagePath}/public`,
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false,
            },
          },
        },
        {
          test: /\.scss$/,
          loader: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        { parser: { import: false } },
      ],
    },
    devServer: {
      contentBase: `${packagePath}/public`,
      compress: false,
      port: 1234,
    },
    plugins,
    node: {
      fs: 'empty',
    },
  };
};
