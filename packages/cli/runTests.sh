#!/usr/bin/env bash
set -e -v

BIN='../../node_modules/.bin/'

## Building extensions
"$BIN"rimraf cdn-emulator
"$BIN"webpack --env.production=true

## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 1111
"$BIN"cpy cypress/fixtures/port-1111-httpFile/workspace.json cdn-emulator/port-1111/configuration
nohup "$BIN"http-server cdn-emulator -p 1111 --cors &>/dev/null &
pid_server_1111=$!

## Run Success scenario #1
## capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888 &>/dev/null &
pid_server_8888=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/1-capsulahub_run.test.js"
kill "$pid_server_8888"

## Run Success scenario #2

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

## Run Success scenario #3
## capsulahub run --token=http://localhost:1111/port-1111/configuration
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration &>/dev/null &
pid_server_55555=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/3-capsulahub_run.test.js"
kill "$pid_server_55555"

## Run Success scenario #4
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234 &>/dev/null &
pid_server_1234=$!
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=4321
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=4321 &>/dev/null &
pid_server_4321=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/4-capsulahub_run.test.js"
kill "$pid_server_1234"
kill "$pid_server_4321"

## Run Success scenario #5

## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 4444
"$BIN"cpy cypress/fixtures/port-4444-httpFile/workspace.json cdn-emulator/port-4444/configuration
nohup "$BIN"http-server cdn-emulator -p 4444 --cors &>/dev/null &
pid_server_4444=$!

# capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234 &>/dev/null &
pid_server_1234=$!
## capsulahub run --token=http://localhost:4444/port-1111/configuration --port=4321
nohup "$BIN"capsulahub run --token=http://localhost:4444/port-4444/configuration --port=4321 &>/dev/null &
pid_server_4321=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/5-capsulahub_run.test.js"
kill "$pid_server_1234"
kill "$pid_server_4321"

## Run Negative scenario #4
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=8888 &>/dev/null &
pid_server_8888=$!
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/negative/4-capsulahub_run.test.js"
kill "$pid_server_8888"

## Run Negative scenario others
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/negative/capsulahub_run.test.js"

## Build scenarios
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_build.test.js"

## Close CDN-emulator
kill "$pid_server_1111"
kill "$pid_server_4444"

