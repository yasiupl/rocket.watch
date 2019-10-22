deploy: install copy build 

install:
	npm ci

copy:
	mkdir -p dist/assets
	cp -r src/assets dist
	cp -r src/static/* dist

build:
	node_modules/.bin/webpack 

serve: 
	node_modules/.bin/webpack-dev-server
