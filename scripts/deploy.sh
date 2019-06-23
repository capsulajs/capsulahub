#!/usr/bin/env bash
set -e

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

replace_special_char() {
    echo $(echo $1 | sed -re "s/[ _*+=’'\"/|$&\`;<>\(\)\?#]/-/g")
}

main() {
    export PATH="$PATH:$HOME/.local/bin"

    # PR
    if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
        branch_name=$(replace_special_char $TRAVIS_PULL_REQUEST_BRANCH)
        SLUG="/PR/$branch_name"
    # master # develop
    elif [[ "$TRAVIS_BRANCH" == "develop" || "$TRAVIS_BRANCH" == "master" ]]; then
        SLUG="/$TRAVIS_BRANCH"
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
    [[ -d "dist" ]] && aws s3 cp dist "$SERVICE_FULL_PATH" --recursive
    [[ -d "public" ]] && aws s3 cp public "$SERVICE_FULL_PATH" --recursive
    [[ "$?" -eq 0 ]] && echo "Service was uploaded to S3 url: $SERVICE_FULL_PATH"

    echo "+++++++++++++++++++++++++++++++++++++++++++"
    ls
    echo "+++++++++++++++++++++++++++++++++++++++++++"

    comment_args=""
    [[ "$HAS_CONFIG" == "true" ]] && aws s3 cp configuration "$SERVICE_FULL_PATH" --recursive && comment_args="${comment_args}-c"
    [[ "$?" -eq 0 ]] && echo "Configuration was uploaded to S3 url: $SERVICE_FULL_PATH"

    [[ "$HAS_DOCS" == "true" ]] && aws s3 cp doc "$SERVICE_FULL_PATH" --recursive && comment_args=" ${comment_args}-d"
    [[ "$?" -eq 0 ]] && echo "Documentation was uploaded to S3 url: $SERVICE_FULL_PATH"

    [[ "$HAS_EXAMPLE" == "true" ]] && aws s3 cp example "$SERVICE_FULL_PATH" --recursive && comment_args=" ${comment_args}-e"
    [[ "$?" -eq 0 ]] && echo "Example was uploaded to S3 url: $SERVICE_FULL_PATH"

    if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
        # add comment on github pull request.
        echo """
        service  -> $SERVICE
        url      -> $FINAL_URL
        args     -> $comment_args
        """
        source ../../scripts/deploy_comment.sh -s "$SERVICE" -u "$FINAL_URL" "$comment_args"
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
#            CONFIG_PATH="${SERVICE_FULL_PATH}configuration"
            ;;
        -d|--docs)
            HAS_DOCS=true
#            DOC_PATH="${SERVICE_FULL_PATH}doc"
            ;;
        -e|--example)
            HAS_EXAMPLE=true
#            EXAMPLE_PATH="${SERVICE_FULL_PATH}example"
            ;;
        *)
            echo "Invalid argument ($arg) not taken into account."
            ;;
    esac
    shift
done

[[ -z "$SERVICE" ]] && echo "Missing required parameter.$USAGE" && exit 1
[[ -z "$HAS_CONFIG" ]] && HAS_CONFIG=false
[[ -z "$HAS_DOCS" ]] && HAS_DOCS=false
[[ -z "$HAS_EXAMPLE" ]] && HAS_EXAMPLE=false

main
