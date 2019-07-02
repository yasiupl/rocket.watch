#!/usr/bin/env bash
node index.js 2>&1 >/dev/null &
sleep 2
curl --silent http://localhost:9000 2>&1 >/dev/null
CURL_EXIT_CODE=$?
#kill `ps | grep node | cut -d" " -f 2`
exit $CURL_EXIT_CODE
