const os = require('os');
const rimraf = require('rimraf');
const Bundler = require('parcel-bundler');
const express = require('express');

import utils from './utils';
import { messages } from './const';

const server = express();

export default (runnerOptions: { entryFile: string; port: number }) => {
  console.info(messages.appIsPending);

  const tempPath = `${os.tmpdir()}/capsulahub`;
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
    try {
      server.listen(port, () => {
        console.info(messages.getAppIsReady(port));
      });
    } catch (error) {
      console.log('-------------');
      console.log(error);
      console.log('-------------');
    }
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
