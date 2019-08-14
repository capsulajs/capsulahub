const WrapperPlugin = require('wrapper-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  entry: {
    'Canvas/index': './src/components/canvas/canvas.js',
    'Catalog/index': './src/components/catalog/catalog.js',
    'Button/index': './src/components/form/button.js',
    'Checkbox/index': './src/components/form/checkbox.js',
    'Dropdown/index': './src/components/form/dropdown.js',
    'Input/index': './src/components/form/input.js',
    'Loader/index': './src/components/loader/loader.js',
    'Logger/index': './src/components/logger/logger.js',
    'Modal/index': './src/components/modal/modal.js',
    'RequestForm/index': './src/components/request-form/request-form.js',
    'Table/index': './src/components/table/table.js',
    'Paragraph/index': './src/components/text/paragraph.js',
    'Span/index': './src/components/text/span.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loaders: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'assets/',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new WrapperPlugin({
      test: /\.js$/,
      header: 'var publicExports = {}; (function () {\n',
      footer: '})();export default publicExports',
    }),
    new BundleAnalyzerPlugin(),
  ],
};
