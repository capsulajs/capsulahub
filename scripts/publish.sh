#!/usr/bin/env bash
set -e

MSG_PUBLISH_SUCCESS="lerna publish: Succeed"
MSG_PUBLISH_FAIL="lerna publish: Failed"

echo "$TRAVIS_BRANCH"
git status

set_git_remote() {
    git remote set-url origin https://${GH_ACCESS_TOKEN}@github.com/capsulajs/capsulahub
}

echo_result() {
    if [[ "$1" == 0 ]]; then
        echo "$MSG_PUBLISH_SUCCESS" && return 0
    else
        echo "$MSG_PUBLISH_FAIL" && return 1
    fi
}

if [[ "$TRAVIS_BRANCH" =~ ^feature\/.*$ ]]; then
    echo "--------------------------------------------"
    echo "|    Deploying snapshot on npm registry    |"
    echo "--------------------------------------------"

    PACKAGE_VERSION="${TRAVIS_BRANCH}.$(date +%s)"
    lerna publish --canary --dist-tag snapshot --preid "$PACKAGE_VERSION" --yes
    echo_result "$?"
    [[ "$?" -eq 0 ]] && lerna run publish:comment -- $(echo $npm_package_name) ${PACKAGE_VERSION}

elif [[ "$TRAVIS_BRANCH" == "develop" ]] && [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "--------------------------------------------"
    echo "|     Deploying latest on npm registry     |"
    echo "--------------------------------------------"

    set_git_remote
    git checkout develop
    lerna publish prerelease --dist-tag next --yes -m '[skip ci]'
    echo_result "$?"

elif [[ "$TRAVIS_BRANCH" == "master" ]] && [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "--------------------------------------------"
    echo "|     Deploying stable on npm registry     |"
    echo "--------------------------------------------"

    set_git_remote
    git checkout master
    lerna publish patch --yes -m '[skip ci]'
    echo_result "$?"

else
    echo "*************************************************"
    echo "*   Not a pull request, npm publish skipped !   *"
    echo "*************************************************"
fi
