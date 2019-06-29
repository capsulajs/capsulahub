import rimraf from 'rimraf';
import path from 'path';
import Bundler from 'parcel-bundler';
import express from 'express';
import net from 'net';
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

  const { entryFile, port } = runnerOptions;
  const tempPath = path.resolve(getTempPath(), `port-${port}`);
  server.use(utils.allowCrossDomainMiddleware);
  server.use(express.static(tempPath));

  exitIfPortBusy(port);

  const options = {
    outDir: tempPath,
    watch: false,
    cache: false,
    contentHash: false,
    minify: false,
    sourceMaps: false,
    logLevel: 1 as 1,
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
        console.error(messages.getAppTempFilesAreNotDeletedError(tempPath), err);
      }
      process.exit(0);
    });
  });
};
