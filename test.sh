$(timeout --preserve-status 5 node index.js 2>/dev/null)
NODE_EXIT_CODE=$?

$(test $NODE_EXIT_CODE = 143)
TEST_RESULT=$?

exit $TEST_RESULT
