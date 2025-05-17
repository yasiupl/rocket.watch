deploy: install copy build 

install:
	npm install

copy:
	mkdir -p dist/assets
	cp -r src/assets dist
	cp -r src/static/* dist

build: copy
	NODE_OPTIONS=--openssl-legacy-provider node_modules/.bin/webpack

serve: copy
	NODE_OPTIONS=--openssl-legacy-provider node_modules/.bin/webpack-dev-server
