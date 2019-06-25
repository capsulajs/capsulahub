import { messages } from './const';

const rimraf = require('rimraf');
const Bundler = require('parcel-bundler');
const express = require('express');
const utils = require('./utils').default;

const server = express();

export default (runnerOptions: { entryFile: string; port: number }) => {
  console.info(messages.appIsPending);

  const tempPath = './node_modules/@capsulajs/capsulahub-cli/temp';
  server.use(utils.allowCrossDomainMiddleware);
  server.use(express.static(tempPath));

  const { entryFile, port } = runnerOptions;

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
    console.info(messages.appIsBundled);
    server.listen(port, () => {
      console.info(messages.getAppIsReady(port));
    });
  });

  bundler.on('buildError', (error: Error) => {
    console.info(messages.appHasBundleError, error);
  });

  bundler.bundle();

  process.on('SIGINT', () => {
    rimraf(tempPath, (err: Error) => {
      if (err) {
        console.log(messages.getAppTempFilesAreNotDeletedError(tempPath), err);
      }
      process.exit(0);
    });
  });
};
