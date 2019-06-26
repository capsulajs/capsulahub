#!/usr/bin/env bash

BIN='../../node_modules/.bin/'

## Building extensions
"$BIN"rimraf cdn-emulator
"$BIN"webpack --env.production=true

## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 1111
"$BIN"cpy cypress/fixtures/port-1111-httpFile/workspace.json cdn-emulator/port-1111/configuration
nohup "$BIN"http-server cdn-emulator -p 1111 --cors &>/dev/null &
pid_server_1111=$!

## Success scenario #1
## capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888 &>/dev/null &
pid_server_8888=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/1-capsulahub_run.test.js"
kill "$pid_server_8888"

## Success scenario #2

## localStorage configProvider
## capsulahub run --token=configuration --configProvider=localStorage --port=7777
nohup "$BIN"capsulahub run --token=configuration --configProvider=localStorage --port=7777 &>/dev/null &
pid_server_7777=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/2-capsulahub_run-local-storage.test.js"
kill "$pid_server_7777"

## httpServer configProvider
## capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpServer --port=7778
nohup "$BIN"capsulahub run --token=http://localhost:1111/configuration --configProvider=httpServer --port=7778 &>/dev/null &
pid_server_7778=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/2-capsulahub_run-http-server.test.js"
kill "$pid_server_7778"

## Success scenario #3
## capsulahub run --token=http://localhost:1111/port-1111/configuration
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration &>/dev/null &
pid_server_55555=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/3-capsulahub_run.test.js"
kill "$pid_server_55555"

## Close CDN-emulator
kill "$pid_server_1111"

