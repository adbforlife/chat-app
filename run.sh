#!/usr/bin/env bash
python server/server.py > /dev/null 2>&1 &
npm start --prefix ./client > /dev/null 2>&1 &
