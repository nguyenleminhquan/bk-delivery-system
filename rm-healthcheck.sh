#!/bin/bash

id=$(docker ps -a -q -f "name=healthcheck")
docker container rm -f $id