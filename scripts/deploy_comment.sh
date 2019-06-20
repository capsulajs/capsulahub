#!/usr/bin/env bash
set -e
if [[ "x$PIPELINEDEBUG" != "x" ]]; then
    set -x
fi

USAGE="""
Usage: ./deploy_comment -s SERVICE [ OPTIONS ]
    -s --service
        Specify the deployed service.
    -u --url
        Specify the url where deploy has been done.
    -c --conf
        Trigger the deployment for service configuration.
    -d --docs
        Trigger the deployment for service documentation.
    -e --example
        Trigger the deployment for service examples.
"""

commentAlreadyExists() {
    comments=$(curl -s -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_URL" | jq -r '.[].body')
    echo "comments --> $comments"
    [[ -z "$comments" ]] && echo "no comments" && return 1
    [[ "$comments" == *"$1"* ]]
    return $?
}

comment(){
    SERVICE_LINK="[**$SERVICE bundle**](${URL}index.js)"
    COMMENTS_URL="https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments"
    COMMENT_TEXT="**Travis-CI** has deployed $SERVICE_LINK"

    [[ "$HAS_CONFIG" == "true" ]] \
        && CONFIG_LINK="[**$SERVICE configuration**](${URL}configuration/index.json)" \
        && COMMENT_TEXT+=" and $CONFIG_LINK" \
        && echo "included configuration"

    [[ "$HAS_DOCS" == "true" ]] \
        && DOC_LINK="[**$SERVICE documentation**](${URL}doc/index.html)" \
        && COMMENT_TEXT+=" and $DOC_LINK" \
        && echo "included documentation"

    [[ "$HAS_EXAMPLE" == "true" ]] \
        && EXAMPLE_LINK="[**$SERVICE documentation**](${URL}example/index.html)" \
        && COMMENT_TEXT+=" and $EXAMPLE_LINK" \
        && echo "included example"

    echo "Links to the deployed files have been generated for PR"
    # Post comment about service if it's not posted yet
    commentAlreadyExists "$COMMENT_TEXT" && echo "Comment already posted" || \
    curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GH_ACCESS_TOKEN" -X POST "$COMMENTS_URL"
    echo "done."
}

# Scripts starts here
[[ $# -lt 2 ]] && echo "$USAGE" && exit 1

while [[ $# -gt 0 ]]; do

    arg="$1"
    case "$arg" in
        -s|--service)
            SERVICE="$2"
            shift
            ;;
        -u|--url)
            URL="$2"
            shift
            ;;
        -c|--conf)
            HAS_CONFIG=true
            ;;
        -d|--docs)
            HAS_DOCS=true
            ;;
        -e|--example)
            HAS_EXAMPLE=true
            ;;
        *)
            echo "Invalid argument ($arg) not taken into account."
            ;;
    esac
    shift
done

[[ -z "$SERVICE" ]] && echo "Missing required parameter.$USAGE" && exit 1
[[ -z "$URL" ]] && echo "Missing required parameter.$USAGE" && exit 1
[[ -z "$HAS_CONFIG" ]] && HAS_CONFIG=false
[[ -z "$HAS_DOCS" ]] && HAS_DOCS=false
[[ -z "$HAS_EXAMPLE" ]] && HAS_EXAMPLE=false

comment
