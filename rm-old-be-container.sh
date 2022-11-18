#!/bin/bash

id=$(docker ps -a -q -f "name=backend")
docker container rm -f $id