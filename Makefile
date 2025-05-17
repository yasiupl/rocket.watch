deploy: install copy build 

install:
	npm install

copy:
	mkdir -p dist/assets
	cp -r src/assets dist
	cp -r src/static/* dist

build: copy
	node_modules/.bin/webpack

serve: copy
	node_modules/.bin/webpack-dev-server
