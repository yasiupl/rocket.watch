deploy: install build 

install:
	npm ci

copy:
	mkdir -p dist/assets
	cp -r src/assets dist

build:
	node_modules/.bin/webpack 

serve: 
	node_modules/.bin/webpack-dev-server
