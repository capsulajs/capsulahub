const Bundler = require('parcel-bundler');
const express = require('express');
const utils = require('./utils').default;

const server = express();

export default (args: any) => {
  server.use(utils.allowCrossDomainMiddleware);
  server.use(express.static('dist'));

  const { entryFile, port } = args;

  const options = {
    outDir: './dist', // The out directory to put the build files in, defaults to dist
    outFile: 'index.html', // The name of the outputFile
    publicUrl: './', // The url to serve on, defaults to '/'
    watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    cache: false, // Enabled or disables caching, defaults to true
    cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
    contentHash: false, // Disable content hash from being included on the filename
    minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
    scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
    target: 'browser', // Browser/node/electron, defaults to browser
    bundleNodeModules: true, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
    sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  };

  const bundler = new Bundler(entryFile, options);

  bundler.on('bundled', () => {
    server.listen(port, () => {
      console.info(`Capsulahub application is ready to use on http://localhost:${port}`);
    });
  });

  bundler.on('buildError', (error: Error) => {
    console.info('Error while bundling Capsulahub application', error);
  });

  bundler.bundle();
};
