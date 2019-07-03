#!/usr/bin/env bash
curl --silent http://localhost:9000 2>&1 >/dev/null
CURL_EXIT_CODE=$?
pkill node
exit $CURL_EXIT_CODE
