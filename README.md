# rocket.watch

[![Build Status](https://travis-ci.com/yasiupl/rocket.watch.svg?branch=master)](https://travis-ci.com/yasiupl/rocket.watch)

Website for watching rocket launches, otherwise - mom's spagetti.

![showcase](https://i.imgur.com/qJ6fE74.png)


## Prerequisites
- node.js
- npm (included with node)

## Development workflow
### Development server
```

```
### Run tests
```
chmod -R +x tests/e2e 
./tests/e2e/smoke-test.sh
node ./tests/e2e/test-redirect.js
```
## Deployment
```
cd frontend
npm install gulp -g
npm install gulp-sass node-sass --save-dev
gulp sass
cd ../backend
npm install
node index.js
```