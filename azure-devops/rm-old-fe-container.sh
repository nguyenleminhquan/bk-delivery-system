#!/bin/bash
id=$(docker ps -a -q -f "name=frontend")

if [[ $id != "" ]];
then
  docker container rm -f $id
else
  echo "No container frontend"
fi