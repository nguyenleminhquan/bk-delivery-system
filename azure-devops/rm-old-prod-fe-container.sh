#!/bin/bash
id=$(docker ps -a -q -f "name=frontend-prod")

if [[ $id != "" ]];
then
  docker container rm -f $id
else
  echo "No product container frontend"
fi