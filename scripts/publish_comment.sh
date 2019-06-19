#!/usr/bin/env bash
set -e
if [[ "x$PIPELINEDEBUG" != "x" ]]; then
    set -x
fi

PACKAGE_NAME=$1
PACKAGE_VERSION=$2
PACKAGE_PAGE="[**npm**](https://www.npmjs.com/package/@capsulajs/${PACKAGE_NAME})"
COMMENTS_URL="https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments"
COMMENT_ID=0

# check if there is already a comment about npm publication
commentAlreadyExists() {
    comments=$(curl -s -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_URL" | jq -r '.[].body')
    echo "comments --> $comments"
    [[ -z "$comments" ]] && echo "no comments" && return 1
    COMMENT_ID=$(curl -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_URL" | jq -r '.[] | select(.body | contains('\"$1\"')) | .id')
    echo "COMMENT_ID -> $COMMENT_ID"
    return $?
}

comment(){
    echo "Links to the published packages generation for PR"
    COMMENT_TEXT="**Travis-CI** has published $EXTENSION_LINK to $PACKAGE_PAGE"

    # Post comment about service if it's not posted yet
    commentAlreadyExists "$COMMENT_TEXT" && echo "Comment already posted" || \
    curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GH_ACCESS_TOKEN" -X POST "$COMMENTS_URL"
    echo "done."
}

comment
