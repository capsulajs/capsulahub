#!/usr/bin/env bash

echo "+++++++++"
ls ../../node_modules/.bin | grep capsulahub
if [[ "$?" -ne 0 ]]; then
    cd ../cdn-emulator/ && yarn && cd -
    echo "Manual install of cdn-emulator package"
    ls ../../node_modules/.bin | grep capsulahub
fi
../../node_modules/.bin/capsulahub --help
echo "+++++++++"

BIN='../../node_modules/.bin/'
EXIT_CODE=0

did_test_failed() {
    if [[ "$?" -gt 0 ]]; then
        ((EXIT_CODE++))
        echo -e "\e[41m  Last test exited with non-zer0 code.  \e[49m"
    else
        echo -e "\e[42m  Last test succeed.  \e[49m"
    fi
}

wait_port() {
    while ! nc -z localhost $1 ; do sleep 1 ; done
}

## Building extensions
"$BIN"rimraf cdn-emulator
"$BIN"webpack --env.production=true
echo "*** Extensions builded ***"

echo """
*****************************************************
|           CLI RUN COMMAND TEST CASES              |
*****************************************************
"""

## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 1111
"$BIN"cpy cypress/fixtures/port-1111-httpFile/workspace.json cdn-emulator/port-1111/configuration
nohup "$BIN"http-server cdn-emulator -p 1111 --cors &>/dev/null &
pid_server_1111=$!
wait_port 1111
echo "Prepared CDN emulation for extensions and configuration for HTTPFile provider on PORT 1111"
echo "ports:" && echo "ports:" && lsof -i -P -n | grep LISTEN

echo """
#+++++++++++++++++++++++++++++++++++++++++++++++++++++
#|               POSITIVE TEST CASES                 |
#+++++++++++++++++++++++++++++++++++++++++++++++++++++
#"""

## Run Success scenario #1
## capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --port=8888 &>/dev/null &
pid_server_8888=$!
wait_port 8888
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/1.test.js"
did_test_failed
kill "$pid_server_8888"

## Run Success scenario #2

## localStorage configProvider
## capsulahub run --token=configuration --configProvider=localStorage --port=7777
nohup "$BIN"capsulahub run --token=configuration --configProvider=localStorage --port=7777 &>/dev/null &
pid_server_7777=$!
wait_port 7777
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/2-local-storage.test.js"
did_test_failed
kill "$pid_server_7777"

## httpServer configProvider
## capsulahub run --token=http://localhost:1111/configuration --configProvider=httpServer --port=7778
nohup "$BIN"capsulahub run --token=http://localhost:1111/configuration --configProvider=httpServer --port=7778 &>/dev/null &
pid_server_7778=$!
wait_port 7778
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/2-http-server.test.js"
did_test_failed
kill "$pid_server_7778"

## localFile configProvider
## capsulahub run --token="./configuration" --configProvider=localFile --port=7779
nohup "$BIN"capsulahub run --token="./configuration" --configProvider=localFile --port=7779 &>/dev/null &
pid_server_7779=$!
wait_port 7779
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/2-local-file.test.js"
did_test_failed
kill "$pid_server_7779"

## scalecube configProvider
## capsulahub run --token="secretToken" --dispatcherUrl="http://localhost:4000" --configProvider=scalecube --port=7780
nohup "$BIN"capsulahub run --token="secretToken" --dispatcherUrl="http://localhost:4000" --configProvider=scalecube --port=7780 &>/dev/null &
pid_server_7780=$!
wait_port 7780
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/2-scalecube.test.js"
did_test_failed
kill "$pid_server_7780"

## Run Success scenario #3
## capsulahub run --token=http://localhost:1111/port-1111/configuration
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration &>/dev/null &
pid_server_55555=$!
wait_port 55555
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/3.test.js"
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
echo "ports:" && lsof -i -P -n | grep LISTEN

wait_port 1234
wait_port 4321
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/4.test.js"
did_test_failed
kill "$pid_server_1234"
kill "$pid_server_4321"

## Success scenario #5
## Preparing CDN emulation for extensions and configuration for HTTPFile provider on PORT 4444
"$BIN"cpy cypress/fixtures/port-4444-httpFile/workspace.json cdn-emulator/port-4444/configuration
nohup "$BIN"http-server cdn-emulator -p 4444 --cors &>/dev/null &
pid_server_4444=$!
wait_port 4444
echo "ports:" && lsof -i -P -n | grep LISTEN


# capsulahub run --token=http://localhost:1111/port-1111/configuration --port=2345
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=2345 &>/dev/null &
pid_server_2345=$!
sleep 1
## capsulahub run --token=http://localhost:4444/port-1111/configuration --port=5432
nohup "$BIN"capsulahub run --token=http://localhost:4444/port-4444/configuration --port=5432 &>/dev/null &
pid_server_5432=$!
echo "ports:" && lsof -i -P -n | grep LISTEN

wait_port 2345
wait_port 5432
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/run/success/5.test.js"
did_test_failed
kill "$pid_server_2345"
kill "$pid_server_5432"

echo """
-----------------------------------------------------
|               NEGATIVE TEST CASES                 |
-----------------------------------------------------
"""

## Negative scenario #4
## capsulahub run --token=http://localhost:1111/port-1111/configuration --port=1234
nohup "$BIN"capsulahub run --token=http://localhost:1111/port-1111/configuration --port=8888 &>/dev/null &
pid_server_8888=$!
wait_port 8888
"$BIN"cypress run --browser chrome --spec "cypress/integration/run/negative/4.test.js"
did_test_failed
kill "$pid_server_8888"

## Run Negative scenario others
"$BIN"cypress run --browser chrome --spec "cypress/integration/run/negative/capsulahub_run.test.js"
did_test_failed

echo """
*****************************************************
|            CLI BUILD COMMAND TEST CASES           |
*****************************************************
"""
echo """
+++++++++++++++++++++++++++++++++++++++++++++++++++++
|               POSITIVE TEST CASES                 |
+++++++++++++++++++++++++++++++++++++++++++++++++++++
"""

## Build Success scenario #1
"$BIN"capsulahub build --token=http://localhost:1111/port-1111/configuration --configProvider=httpFile --output=outputDir
nohup "$BIN"http-server outputDir -p 8888 &>/dev/null &
pid_server_8888=$!
wait_port 8888
echo "ports:" && lsof -i -P -n | grep LISTEN

"$BIN"cypress run --browser chrome --spec "cypress/integration/build/success/1.test.js"
did_test_failed
rm -rf outputDir/

## Run Success scenario #2

## localStorage configProvider
"$BIN"capsulahub build --token=configuration --configProvider=localStorage --output=outputDir

"$BIN"cypress run --browser chrome --spec "cypress/integration/build/success/2-local-storage.test.js"
did_test_failed2

## httpServer configProvider
"$BIN"capsulahub build --token=http://localhost:1111/configuration --configProvider=httpServer --output=outputDir

"$BIN"cypress run --browser chrome --spec "cypress/integration/build/success/2-http-server.test.js"
did_test_failed

## localFile configProvider
"$BIN"cypress run --browser chrome --spec "cypress/integration/build/success/2-local-file.test.js"
did_test_failed

## scalecube configProvider
"$BIN"capsulahub build --token=secretToken --configProvider=scalecube --output=outputDir --dispatcherUrl="http://localhost:4000"

"$BIN"cypress run --browser chrome --spec "cypress/integration/build/success/2-scalecube.test.js"
did_test_failed

kill "$pid_server_8888"

## Run Success scenario #3
"$BIN"capsulahub build --token=http://localhost:1111/port-1111/configuration
nohup "$BIN"http-server dist -p 55555 &>/dev/null &
pid_server_55555=$!
wait_port 55555
echo "ports:" && lsof -i -P -n | grep LISTEN
"$BIN"cypress run --browser chrome --spec "cypress/integration/build/success/3.test.js"
did_test_failed
kill "$pid_server_55555"

echo """
+++++++++++++++++++++++++++++++++++++++++++++++++++++
|               NEGATIVE TEST CASES                 |
+++++++++++++++++++++++++++++++++++++++++++++++++++++
"""

"$BIN"cypress run --browser chrome --spec "cypress/integration/build/negative/capsulahub_build.test.js"
did_test_failed

## Close CDN-emulator
kill "$pid_server_1111"
#kill "$pid_server_4444"
rm -rf dist/ outputDir/ bin/temp/
echo "Closed CDN Emulator and cleaned dist/, outputDir/ and bin/temp/."

if [[ "$EXIT_CODE" -eq 0 ]]; then
    echo -e "\e[42m  The tests are successful.\e[49m"
else
    echo -e "\e[41m  $EXIT_CODE test(s) failed.\e[49m"
fi

exit "$EXIT_CODE"
