#!/usr/bin/sh

npm install
fuser -k 3006/tcp
./build.js --recipe=devel --serve=3006 &
