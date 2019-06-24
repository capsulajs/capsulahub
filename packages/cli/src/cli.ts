#!/usr/bin/env node

import commander from 'commander';
import path from 'path';

commander
  .command('run')
  .description('Run a Capsulahub instance')
  .option('-t, --token <token>', 'The token that will be used to get the configuration (required)')
  .option(
    '-p, --port <port>',
    'The port on which the application will run locally (for instance, http://localhost:5555/) (optional - default is "55555")'
  )
  .action((args) => {
    const runner = require('./helpers/runner').default;
    const { token, port } = args;
    runner({
      entryFilesPath: path.join(__dirname, '..', 'app', 'index.html'),
      token,
      port: port || 5555,
      entryFile: path.resolve(),
    });
  });

commander.parse(process.argv);
