const rimraf = require('rimraf');
const Bundler = require('parcel-bundler');
const express = require('express');
const net = require('net');
import utils from './utils';
import { getTempPath, messages } from './const';

const server = express();

const exitIfPortBusy = (port: number) => {
  console.info(messages.checkingPort);
  const serverTmp = net.createServer();
  serverTmp.once('error', (error: Error) => {
    error.message.includes('EADDRINUSE') ? console.error(messages.portAlreadyInUse(port)) : console.error(error);
    process.exit(1);
  });
  serverTmp.once('listening', () => serverTmp.close());
  serverTmp.listen(port);
};

export default (runnerOptions: { entryFile: string; port: number }) => {
  console.info(messages.appIsPending);

  const tempPath = getTempPath();
  server.use(utils.allowCrossDomainMiddleware);
  server.use(express.static(tempPath));

  const { entryFile, port } = runnerOptions;

  exitIfPortBusy(port);

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
