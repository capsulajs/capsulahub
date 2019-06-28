#!/usr/bin/env bash
set -v

BIN='../../node_modules/.bin/'
EXIT_CODE=0

did_test_failed() {
    [[ "$?" -gt 0 ]] && ((EXIT_CODE++))
    echo "Last test exited with non-zer0 code."
}

waitport() {
    while ! nc -z localhost $1 ; do sleep 1 ; done
}

## Building extensions
"$BIN"rimraf cdn-emulator
"$BIN"webpack --env.production=true

# *****************************************************
# |           CLI RUN COMMAND TEST CASES              |
# *****************************************************

## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 1111
"$BIN"cpy cypress/fixtures/port-1111-httpFile/workspace.json cdn-emulator/port-1111/configuration
nohup "$BIN"http-server cdn-emulator -p 1111 --cors &>/dev/null &
pid_server_1111=$!

# +++++++++++++++++++++++++++++++++++++++++++++++++++++
# |               POSITIVE TEST CASES                 |
# +++++++++++++++++++++++++++++++++++++++++++++++++++++

waitport 1111
## Run Success scenario #1
## capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888 &>/dev/null &
pid_server_8888=$!
waitport 8888
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/1-capsulahub_run.test.js"
did_test_failed
kill "$pid_server_8888"

## Run Success scenario #2

## localStorage configProvider
## capsulahub run --token=configuration --configProvider=localStorage --port=7777
nohup "$BIN"capsulahub run --token=configuration --configProvider=localStorage --port=7777 &>/dev/null &
pid_server_7777=$!
waitport 7777
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/2-capsulahub_run-local-storage.test.js"
did_test_failed
kill "$pid_server_7777"

## httpServer configProvider
## capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpServer --port=7778
nohup "$BIN"capsulahub run --token=http://localhost:1111/configuration --configProvider=httpServer --port=7778 &>/dev/null &
pid_server_7778=$!
waitport 7778
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/2-capsulahub_run-http-server.test.js"
did_test_failed
kill "$pid_server_7778"

## localFile configProvider
## capsulahub run --token="./configuration" --configProvider=localFile --port=7779
nohup "$BIN"capsulahub run --token="./configuration" --configProvider=localFile --port=7779 &>/dev/null &
pid_server_7779=$!
waitport 7779
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/2-capsulahub_run-local-file.test.js"
did_test_failed
kill "$pid_server_7779"

## Run Success scenario #3
## capsulahub run --token=http://localhost:1111/port-1111/configuration
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration &>/dev/null &
pid_server_55555=$!
waitport 55555
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/3-capsulahub_run.test.js"
did_test_failed
kill "$pid_server_55555"

## Run Success scenario #4
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234 &>/dev/null &
pid_server_1234=$!
sleep 1
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=4321
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=4321 &>/dev/null &
pid_server_4321=$!
waitport 1234
waitport 4321
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/4-capsulahub_run.test.js"
did_test_failed
kill "$pid_server_1234"
kill "$pid_server_4321"

## Success scenario #5
## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 4444
"$BIN"cpy cypress/fixtures/port-4444-httpFile/workspace.json cdn-emulator/port-4444/configuration
nohup "$BIN"http-server cdn-emulator -p 4444 --cors &>/dev/null &
pid_server_4444=$!
waitport 4444

# capsulahub run --token=http://localhost:1111/port-1111/configuration --port=2345
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=2345 &>/dev/null &
pid_server_2345=$!
sleep 1
## capsulahub run --token=http://localhost:4444/port-1111/configuration --port=5432
nohup "$BIN"capsulahub run --token=http://localhost:4444/port-4444/configuration --port=5432 &>/dev/null &
pid_server_5432=$!
waitport 2345
waitport 5432
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/success/5-capsulahub_run.test.js"
did_test_failed
kill "$pid_server_2345"
kill "$pid_server_5432"

# -----------------------------------------------------
# |               NEGATIVE TEST CASES                 |
# -----------------------------------------------------

## Negative scenario #4
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=8888 &>/dev/null &
pid_server_8888=$!
waitport 8888
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/negative/4-capsulahub_run.test.js"
did_test_failed
kill "$pid_server_8888"

## Run Negative scenario others
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_run/negative/capsulahub_run.test.js"
did_test_failed

# *****************************************************
# |            CLI BUILD COMMAND TEST CASES           |
# *****************************************************
"$BIN"cypress run --browser chrome --spec "cypress/integration/capsulahub_build.test.js"
did_test_failed

## Close CDN-emulator
kill "$pid_server_1111"
kill "$pid_server_4444"
rm -rf dist/ outputDir/
rm -rf bin/temp/


echo "$EXIT_CODE"
exit "$EXIT_CODE"
