#!/bin/bash

id=$(docker ps -a -q -f "name=backend")
if [ -n $id ]; 
then
  docker container rm -f $id