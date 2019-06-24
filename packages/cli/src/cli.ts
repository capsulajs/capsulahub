#!/usr/bin/env node

import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import commander from 'commander';
import path from 'path';

commander
  .command('run')
  .description('Run a Capsulahub instance')
  .option('-t, --token <token>', 'The token that will be used to get the configuration (required)')
  .option(
    '-c, --configProvider <configProvider>',
    "The type of configuration provider (optional - default is \"httpFile\"). Possible options: 'localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'"
  )
  .option(
    '-p, --port <port>',
    'The port on which the application will run locally (for instance, http://localhost:55555/) (optional - default is "55555")'
  )
  .option(
    '-d, --dispatcherUrl <dispatcherUrl>',
    'The url of the dispatcher for those providers that use dispatcher (optional)'
  )
  .action((args) => {
    const runner = require('./helpers/runner').default;
    const { token, port = 55555, configProvider = configurationTypes.httpFile } = args;
    process.env.TOKEN = token;
    process.env.CONFIG_PROVIDER = configProvider;

    runner({
      entryFile: path.join(__dirname, '..', 'app', 'index.html'),
      token,
      port,
    });
  });

commander.parse(process.argv);
