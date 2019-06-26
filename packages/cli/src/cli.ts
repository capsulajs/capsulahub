#!/usr/bin/env node

import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import commander from 'commander';
import path from 'path';
import { args } from './helpers/const';
import { argsValidator } from './helpers/validators';

commander
  .command('run')
  .description('Run a Capsulahub application locally in development mode')
  .option(`-t, --${args.token.title} <${args.token.title}>`, args.token.description)
  .option(`-c, --${args.configProvider.title} <${args.configProvider.title}>`, args.configProvider.description)
  .option(`-p, --${args.port.title} <${args.port.title}>`, args.port.description)
  .option(`-d, --${args.dispatcherUrl.title} <${args.dispatcherUrl.title}>`, args.dispatcherUrl.description)
  .action((opts) => {
    const { isValid, error } = argsValidator(opts);
    if (!isValid) {
      console.error(error);
      process.exit(1);
    }
    const runner = require('./helpers/runner').default;
    const { token, port = 55555, configProvider = configurationTypes.httpFile } = opts;
    process.env.CAPSULAHUB_TOKEN = token;
    process.env.CAPSULAHUB_CONFIG_PROVIDER = configProvider;

    runner({
      entryFile: path.join(__dirname, '..', 'app', 'index.html'),
      token,
      port,
    });
  });

commander
  .command('build')
  .description('Build Capsulahub application files in a specific folder (ready to deploy)')
  .option(`-t, --${args.token.title} <${args.token.title}>`, args.token.description)
  .option(`-c, --${args.configProvider.title} <${args.configProvider.title}>`, args.configProvider.description)
  .option(`-o, --${args.output.title} <${args.output.title}>`, args.output.description)
  .option(`-d, --${args.dispatcherUrl.title} <${args.dispatcherUrl.title}>`, args.dispatcherUrl.description)
  .action((opts) => {
    const { isValid, error } = argsValidator(opts);
    if (!isValid) {
      console.error(error);
      process.exit(1);
    }
    const builder = require('./helpers/builder').default;
    const { token, output = './dist', configProvider = configurationTypes.httpFile } = opts;
    process.env.CAPSULAHUB_TOKEN = token;
    process.env.CAPSULAHUB_CONFIG_PROVIDER = configProvider;

    builder({
      entryFile: path.join(__dirname, '..', 'app', 'index.html'),
      token,
      output,
    });
  });

commander.parse(process.argv);
