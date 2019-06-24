const rimraf = require('rimraf');
const Bundler = require('parcel-bundler');
const express = require('express');
const utils = require('./utils').default;

const server = express();

export default (args: any) => {
  console.info('Starting Capsulahub application...');

  const tempPath = './node_modules/@capsulajs/capsulahub-cli/temp';
  server.use(utils.allowCrossDomainMiddleware);
  server.use(express.static(tempPath));

  const { entryFile, port } = args;

  const options = {
    outDir: tempPath,
    watch: false,
    cache: false,
    contentHash: false,
    minify: false,
    sourceMaps: false,
    logLevel: 1,
  };

  const bundler = new Bundler(entryFile, options);

  bundler.on('bundled', () => {
    console.info(`Capsulahub application has been bundled successfully`);
    server.listen(port, () => {
      console.info(`Capsulahub application is ready to be used on http://localhost:${port}`);
    });
  });

  bundler.on('buildError', (error: Error) => {
    console.info('Error while bundling Capsulahub application', error);
  });

  bundler.bundle();

  process.on('SIGINT', () => {
    rimraf(tempPath, (err: Error) => {
      if (err) {
        console.log(`Temporary Capsulahub files were not deleted from ${tempPath}`, err);
      }
      process.exit(0);
    });
  });
};
