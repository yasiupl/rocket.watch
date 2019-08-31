#!/usr/bin/env bash
node index.js 2>&1 >/dev/null &
sleep 2
curl --silent http://localhost:9000 2>&1 >/dev/null
CURL_EXIT_CODE=$?
sleep 2
pkill node
echo $CURL_EXIT_CODE
exit $CURL_EXIT_CODE
