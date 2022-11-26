#!/bin/bash
id=$(docker ps -a -q -f "name=frontend-dev")

if [[ $id != "" ]];
then
  docker container rm -f $id
else
  echo "No dev container frontend"
fi