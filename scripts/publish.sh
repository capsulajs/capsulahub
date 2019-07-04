#!/usr/bin/env bash
set -e

MSG_PUBLISH_SUCCESS="lerna publish: Succeed"
MSG_PUBLISH_FAIL="lerna publish: Failed"

echo "travis branch    -> $TRAVIS_BRANCH"
echo "travis PR branch -> $TRAVIS_PULL_REQUEST_BRANCH"
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

if [[ "$TRAVIS_PULL_REQUEST_BRANCH" =~ ^feature\/.*$ ]]; then
    echo "--------------------------------------------"
    echo "|    Deploying snapshot on npm registry    |"
    echo "--------------------------------------------"

    VERSION_NUMBER=$(npm version | grep @ | sed -re "s/\{ '.*': '(.*)',?/\1/g")
    VERSION_NUMBER=$(perl -spe 's/(\d+)(?!.*\d+)/$1>$thresh? $1+1 : $1/e' <<< "$VERSION_NUMBER")
    echo "version      -> $VERSION_NUMBER"
    BRANCH_NAME=$(echo $TRAVIS_PULL_REQUEST_BRANCH | sed "s/[_/]/-/g")
    echo "branch name  -> $BRANCH_NAME"
    PACKAGE_VERSION="alpha.$(date +%s)"
    lerna publish --canary --dist-tag snapshot --preid "$PACKAGE_VERSION" --yes --since develop
    echo_result "$?"
    lerna run --since develop publish:comment -- "alpha" ${PACKAGE_VERSION}

elif [[ "$TRAVIS_BRANCH" == "develop" ]] && [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "--------------------------------------------"
    echo "|     Deploying latest on npm registry     |"
    echo "--------------------------------------------"

    set_git_remote
    git checkout develop
    lerna publish prerelease --canary --preid next --dist-tag next --yes -m '[skip ci]'
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
