#!/usr/bin/env node

import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import commander from 'commander';
import fs from 'fs';
import path from 'path';
import { args, getTempPath } from './helpers/const';
import { argsValidator } from './helpers/validators';
import * as API from './helpers/types';

commander
  .command('run')
  .description('Run a Capsulahub application locally in development mode')
  .option(`-t, --${args.token.title} <${args.token.title}>`, args.token.description)
  .option(`-c, --${args.configProvider.title} <${args.configProvider.title}>`, args.configProvider.description)
  .option(`-p, --${args.port.title} <${args.port.title}>`, args.port.description)
  .option(`-r, --${args.repository.title} <${args.repository.title}>`, args.repository.description)
  .option(`-d, --${args.dispatcherUrl.title} <${args.dispatcherUrl.title}>`, args.dispatcherUrl.description)
  .action((opts) => {
    const { isValid, error } = argsValidator(opts);
    if (!isValid) {
      console.error(error);
      process.exit(1);
    }
    const runner = require('./helpers/runner').default;
    const { token, port = 55555, configProvider = configurationTypes.httpFile, dispatcherUrl, repository } = opts;

    const appConfigPath = path.resolve(getTempPath(), '..', 'app-config.json');

    fs.readFile(appConfigPath, (readFileError, oldAppConfigBuffer) => {
      if (readFileError) {
        console.error(`Error while updating app configs: ${readFileError}`);
        process.exit(1);
      }

      const content: API.AppConfig = {
        ...JSON.parse(oldAppConfigBuffer.toString()),
        [port]: {
          token,
          configProvider,
          dispatcherUrl,
          repository,
        },
      };

      fs.writeFile(appConfigPath, JSON.stringify(content), () => {
        runner({
          entryFile: path.join(__dirname, '..', 'app', 'index.html'),
          token,
          port,
        });
      });
    });
  });

commander
  .command('build')
  .description('Build Capsulahub application files in a specific folder (ready to deploy)')
  .option(`-t, --${args.token.title} <${args.token.title}>`, args.token.description)
  .option(`-c, --${args.configProvider.title} <${args.configProvider.title}>`, args.configProvider.description)
  .option(`-o, --${args.output.title} <${args.output.title}>`, args.output.description)
  .option(`-r, --${args.repository.title} <${args.repository.title}>`, args.repository.description)
  .option(`-d, --${args.dispatcherUrl.title} <${args.dispatcherUrl.title}>`, args.dispatcherUrl.description)
  .action((opts) => {
    const { isValid, error } = argsValidator(opts);
    if (!isValid) {
      console.error(error);
      process.exit(1);
    }
    const builder = require('./helpers/builder').default;
    const { token, output = './dist', configProvider = configurationTypes.httpFile, dispatcherUrl, repository } = opts;
    process.env.CAPSULAHUB_TOKEN = token;
    process.env.CAPSULAHUB_CONFIG_PROVIDER = configProvider;
    process.env.CAPSULAHUB_DISPATCHER_URL = dispatcherUrl;
    process.env.CAPSULAHUB_REPOSITORY = repository;

    builder({
      entryFile: path.join(__dirname, '..', 'app', 'index.html'),
      token,
      output,
    });
  });

commander.parse(process.argv);
