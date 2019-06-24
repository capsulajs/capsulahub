#!/usr/bin/env node

import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import commander from 'commander';
import path from 'path';
import { args } from './helpers/const';

commander
  .command('run')
  .description('Run a Capsulahub instance')
  .option(`-t, --${args.token.title} <${args.token.title}>`, args.token.description)
  .option(`-c, --${args.configProvider.title} <${args.configProvider.title}>`, args.configProvider.description)
  .option(`-p, --${args.port.title} <${args.port.title}>`, args.port.description)
  .option(`-d, --${args.dispatcherUrl.title} <${args.dispatcherUrl.title}>`, args.dispatcherUrl.description)
  .action((args) => {
    const runner = require('./helpers/runner').default;
    const { token, port = 55555, configProvider = configurationTypes.httpFile } = args;
    process.env.CAPSULAHUB_TOKEN = token;
    process.env.CAPSULAHUB_CONFIG_PROVIDER = configProvider;

    runner({
      entryFile: path.join(__dirname, '..', 'app', 'index.html'),
      token,
      port,
    });
  });

commander.parse(process.argv);
