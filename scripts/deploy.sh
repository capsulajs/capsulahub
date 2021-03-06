#!/usr/bin/env bash
set -e

USAGE="""
Usage: ./deploy -s SERVICE [ OPTIONS ]
    -s --service
        Specify the service to deploy.
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

    [[ -d "dist/configuration" ]] && comment_conf="--conf"
    [[ -d "dist/doc" ]] && comment_docs="--docs"
    [[ -d "dist/example" ]] && comment_example="--example"

    if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
        # add comment on github pull request.
        echo """
        service  -> $SERVICE
        url      -> $FINAL_URL
        args     -> $comment_conf $comment_docs $comment_example
        """
        source ../../scripts/deploy_comment.sh "-s" "$SERVICE" "-u" "$FINAL_URL" "$comment_conf" "$comment_docs" "$comment_example"
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
        *)
            echo "Invalid argument ($arg) not taken into account."
            ;;
    esac
    shift
done

[[ -z "$SERVICE" ]] && echo "Missing required parameter.$USAGE" && exit 1

main
