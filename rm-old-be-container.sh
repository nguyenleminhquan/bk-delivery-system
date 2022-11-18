#!/bin/bash
id=$(docker ps -a -q -f "name=backend")

if [[ $id != "" ]];
then
  docker container rm -f $id
else
  echo "No container backend"
fi