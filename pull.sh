#!/bin/bash

docker pull $REPO_BACKEND:$BE_IMAGE_TAG
docker pull $REPO_FRONTEND:$FE_IMAGE_TAG
