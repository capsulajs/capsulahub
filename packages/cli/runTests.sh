#!/usr/bin/env bash

BIN='../../node_modules/.bin/'

"$BIN"rimraf cdn-emulator
"$BIN"webpack --env.production=true
"$BIN"cpy cypress/support/cdn-emulator/port-1111/configuration/workspace.json cdn-emulator/port-1111/configuration

nohup "$BIN"http-server cdn-emulator -p 1111 --cors &>/dev/null &
pid_server_1111=$!

nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888 &>/dev/null &
pid_server_8888=$!

"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/1-capsulahub_run.test.js"

echo "done"
kill "$pid_server_1111"
kill "$pid_server_8888"
