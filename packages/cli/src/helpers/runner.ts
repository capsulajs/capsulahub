import webpack from 'webpack';
import path from 'path';
// @ts-ignore
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default () => {
  console.log('inside the runner');

  const compiler = webpack({
    // @ts-ignore
    mode: 'development',
    entry: path.resolve(__dirname, '/src/index.ts'),
    output: {
      path: path.resolve(__dirname, '/public'),
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
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loaders: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'assets/',
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
        { parser: { import: false } },
      ],
    },
    devServer: {
      contentBase: path.resolve(__dirname, '/public'),
      compress: false,
      port: 5555,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/example/index.html',
      }),
    ],
    node: {
      fs: 'empty',
    },
  });

  compiler.run((err: any, stats: any) => {
    console.log('err', err);
    console.log('stats', stats);
  });
};
