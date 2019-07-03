.DEFAULT_GOAL := help

# Porcelain
# ###############
.PHONY: env-up env-down serve ci build lint test container

launch: build open-browser ## run the development server and open browser
	node_modules/.bin/live-server static/

serve: build ## run the development server
	node_modules/.bin/live-server --no-browser static/

ci: lint test build container ## run all test and build all artifacts
	@echo "Not implemented"; false

env-up: ## set up dev environment
	@echo "Not implemented"; false

env-down: ## tear down dev environment
	@echo "Not implemented"; false

build: compile-sass ## create artifact

lint: ## run static analysis
	@echo "Not implemented"; false

test: ## run all tests
	@echo "Not implemented"; false

container: ## build container
	@echo "Not implemented"; false


# Plumbing
# ###############
.PHONY: compile-sass open-browser

compile-sass: node_modules
	node_modules/.bin/gulp sass

node_modules: package.json package-lock.json 
	npm ci

open-browser: 
	(sleep 2; xdg-open localhost:8080) &


# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
