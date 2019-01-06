#!/usr/bin/env bash
python3 server/server.py > /dev/null 2>&1 &
npm start --prefix ./client > /dev/null 2>&1 &
