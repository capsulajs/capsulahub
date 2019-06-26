const path = require('path');
const includePath = path.resolve(__dirname, '..');

module.exports = {
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loaders: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'assets/',
        },
      },
      {
        test: /\.(css|less)$/,
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
  resolve: {
    alias: {
      src: path.resolve('./src'),
    },
  },
};
