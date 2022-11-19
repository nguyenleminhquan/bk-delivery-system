#!/bin/bash

sleep 10
id=$(docker ps -a -q -f "name=healthcheck")
status=$(docker container inspect --format='{{json .State.Health.Status}}' $id)
sub="un"

if [[ $status == *"$sub"* ]]
then
  exit 1
fi