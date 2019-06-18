#!/usr/bin/env bash
if [ "x$PIPELINEDEBUG" != "x" ]; then
    set -x
fi
PACKAGE_NAME=$1
URL=$2
INCLUDE_DOC=$3
COMMENTS_URL="https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments"
EXTENSION_LINK="[**$PACKAGE_NAME bundle**](${URL}index.js)"
if [[ $PACKAGE_NAME == "exchange-sandbox" ]]; then
    EXTENSION_LINK="[**$PACKAGE_NAME application**](${URL}index.html)"
    WORKSPACE_CONFIGURATION_LINK="[**workspace configuration**](${URL}configuration/workspace.json)"
fi
DOC_LINK="[**$PACKAGE_NAME documentation**](${URL}doc/index.html)"

commentAlreadyExists() {
    comments=$(curl -s -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_URL" | jq -r '.[].body')
    echo "comments --> $comments"
    [[ -z "$comments" ]] && echo "no comments" && return 1
    [[ "$comments" == *"$1"* ]]
    return $?
}

comment(){
    COMMENT_TEXT="**Travis-CI** has deployed $EXTENSION_LINK"
    if [ x"$INCLUDE_DOC" == x"true" ]; then
        echo "included docs"
        COMMENT_TEXT+=", $DOC_LINK"
    fi
    if [ $PACKAGE_NAME == "exchange-sandbox" ]; then
        echo "included workspace configuration"
        COMMENT_TEXT+=", $WORKSPACE_CONFIGURATION_LINK"
    fi
    echo "Links to the deployed files have been generated for PR"

    # Post comment about service if it's not posted yet
    commentAlreadyExists "$COMMENT_TEXT" && echo "Comment already posted" || \
    curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GH_ACCESS_TOKEN" -X POST "$COMMENTS_URL"
    echo "done."
}

comment
