#!/bin/bash

_flavor=$1

export BE_PORT=5000
export FE_PORT=3000
export FE_IMAGE_TAG=$_flavor
export BE_IMAGE_TAG=$_flavor
export COMPOSE_PRJ_NAME="bds-${_flavor}"

export BDS_NETWORK="bds-${_flavor}"
export FE_NAME="frontend-${_flavor}"
export BE_NAME="backend-${_flavor}"