.DEFAULT_GOAL := help
PORT := 9000

NPM_BINARY_PREFIX := ./node_modules/.bin
SOURCES := index.js src

LINTER := $(NPM_BINARY_PREFIX)/eslint

# Porcelain
# ###############
.PHONY: env-up env-down serve ci build lint test container

launch: setup open-browser ## run the development server and open browser
	PORT=$(PORT) node index.js
	
serve: setup ## run the development server
	PORT=$(PORT) node index.js

ci: setup lint test build container ## run all tests and build all artifacts
	@echo "Not implemented"; false

env-up: ## set up dev environment
	@echo "Not implemented"; false

env-down: ## tear down dev environment
	@echo "Not implemented"; false

build: setup ## create artifact
	@echo "Not implemented"; false

fmt: ## automatically reformat the sources according to linter configuration
	$(LINTER) --fix $(SOURCES)

lint: ## run static analysis
	$(LINTER) $(SOURCES)

test: setup test-e2e ## run all tests

container: ## build container
	@echo "Not implemented"; false


# Plumbing
# ###############
.PHONY: open-browser test-e2e setup

setup: node_modules config.json

test-e2e: node_modules 
	# TODO: fix this
	#tests/e2e/setup
	#tests/e2e/smoke-test.sh
	#node tests/e2e/test-redirect.js
	#tests/e2e/teardown

node_modules: package.json package-lock.json 
	npm ci

config.json: config.template.json
	cp config.template.json config.json

open-browser: 
	(sleep 2; xdg-open localhost:$(PORT)/api) &

# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
