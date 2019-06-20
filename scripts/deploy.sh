#!/usr/bin/env bash
set -e
if [[ "x$PIPELINEDEBUG" != "x" ]]; then
    set -x
fi

USAGE="""
Usage: ./deploy -s SERVICE [ OPTIONS ]
    -s --service
        Specify the service to deploy.
    -c --conf
        Trigger the deployment for service configuration.
    -d --docs
        Trigger the deployment for service documentation.
    -e --example
        Trigger the deployment for service examples.
"""

main() {
    export PATH="$PATH:$HOME/.local/bin"

    # PR
    if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
        SLUG="/PR/$TRAVIS_PULL_REQUEST_BRANCH"
    # master # develop
    elif [[ "$TRAVIS_BRANCH" == "develop" ]]; then
        SLUG="/$TRAVIS_BRANCH"
    elif [[ "$TRAVIS_BRANCH" == "master" ]]; then
        SLUG="/rc"
    fi;

    S3_PATH="s3://$S3_BUCKET"
    SERVICE_PATH="$SLUG/$SERVICE/"
    SERVICE_FULL_PATH="$S3_PATH$SERVICE_PATH"
    FINAL_URL="$BUCKET_BASE_URL$SERVICE_PATH"

    echo "---------------------------------------------------------------"
    echo "current branch    : $TRAVIS_BRANCH $TRAVIS_PULL_REQUEST_BRANCH"
    echo "is pull request   : $TRAVIS_PULL_REQUEST"
    echo "S3 Path           : $S3_PATH"
    echo "travis event type : $TRAVIS_EVENT_TYPE"
    echo "S3 URL            : $FINAL_URL"
    echo "SERVICE_PATH      : $SERVICE_PATH"
    echo "SERVICE_FULL_PATH : $SERVICE_FULL_PATH"
    echo "---------------------------------------------------------------"

    [[ -z "$SERVICE_PATH" ]] && echo "Error: Empty SERVICE_PATH" && exit 1

    # upload to s3
    aws s3 rm "$SERVICE_FULL_PATH" --recursive --region "$S3_REGION"
    aws s3 cp dist "$SERVICE_FULL_PATH" --recursive
    [[ "$?" -eq 0 ]] && echo "Service was uploaded to S3 url: $SERVICE_FULL_PATH"

    [[ "$HAS_CONFIG" == "true" ]] && aws s3 cp configuration "$CONFIG_PATH" --recursive
    [[ "$?" -eq 0 ]] && echo "Configuration was uploaded to S3 url: $CONFIG_PATH"

    [[ "$HAS_DOCS" == "true" ]] && aws s3 cp doc "$DOC_PATH" --recursive
    [[ "$?" -eq 0 ]] && echo "Documentation was uploaded to S3 url: $DOC_PATH"

    [[ "$HAS_EXAMPLE" == "true" ]] && aws s3 cp example "$EXAMPLE_PATH" --recursive
    [[ "$?" -eq 0 ]] && echo "Example was uploaded to S3 url: $EXAMPLE_PATH"

    if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
        # add comment on github pull request.
        source ../../scripts/deploy_comment.sh "$SERVICE" "$FINAL_URL" "$INCLUDE_DOC"
        echo "Comment sent to GH pull request: $TRAVIS_BRANCH $TRAVIS_PULL_REQUEST_BRANCH PR $TRAVIS_PULL_REQUEST"
    else
        echo "Comment was skipped not a pull request or comment already created."
    fi
}

[[ $# -lt 2 ]] && echo "$USAGE" && exit 1

while [[ $# -gt 0 ]]; do

    arg="$1"
    case "$arg" in
        -s|--service)
            SERVICE="$2"
            shift
            ;;
        -c|--conf)
            HAS_CONFIG=true
            CONFIG_PATH="${SERVICE_FULL_PATH}configuration"
            ;;
        -d|--docs)
            HAS_DOCS=true
            DOC_PATH="${SERVICE_FULL_PATH}doc"
            ;;
        -e|--example)
            HAS_EXAMPLE=true
            EXAMPLE_PATH="${SERVICE_FULL_PATH}example"
            ;;
        *)
            echo "Invalid argument $arg."
            return 1
            ;;
    esac
    shift
done

[[ -z "$SERVICE" ]] && echo "Missing required parameter.$USAGE" && exit 1
[[ -z "$HAS_CONFIG" ]] && HAS_CONFIG=false
[[ -z "$HAS_DOCS" ]] && HAS_DOCS=false
[[ -z "$HAS_EXAMPLE" ]] && HAS_EXAMPLE=false

main
