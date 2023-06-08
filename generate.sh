#!/bin/bash

cp -f config-$1.json frontend/src/config/.env.json
cp -f config-$1.json backend/config/.env.json