.DEFAULT_GOAL := help
PORT := 9000

NPM_BINARY_PREFIX := ./node_modules/.bin
SOURCES := index.js src tests

LINTER := $(NPM_BINARY_PREFIX)/eslint

# Porcelain
# ###############
.PHONY: env-up env-down serve ci build lint test container

launch: setup open-browser ## run the development server and open browser
	PORT=$(PORT) node index.js
	
serve: setup ## run the development server
	PORT=$(PORT) node index.js

ci: audit setup lint build test container ## run all tests and build all artifacts
	@echo "Not implemented"; false

env-up: ## set up dev environment
	@echo "Not implemented"; false

env-down: ## tear down dev environment
	@echo "Not implemented"; false

build: setup ## create artifact
	@echo "Not implemented"; false

fmt: setup ## automatically reformat the sources according to linter configuration
	$(LINTER) --fix $(SOURCES)

lint: setup ## run static analysis
	$(LINTER) $(SOURCES)

test: setup test-unit test-e2e ## run all tests

container: setup build ## build container
	@echo "Not implemented"; false


# Plumbing
# ###############
.PHONY: open-browser test-e2e setup test-unit

audit:
	npm audit

setup: node_modules config.json

test-e2e:
	tests/e2e/smoke-test.sh

test-unit:
	$(NPM_BINARY_PREFIX)/jest

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
