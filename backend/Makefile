.DEFAULT_GOAL := help

# Porcelain
# ###############
.PHONY: env-up env-down serve ci build lint test container

serve: ## run the development server
	@echo "Not implemented"; false

ci: lint test build container ## run all test and build all artifacts
	@echo "Not implemented"; false

env-up: ## set up dev environment
	@echo "Not implemented"; false

env-down: ## tear down dev environment
	@echo "Not implemented"; false

build: ## create artifact
	@echo "Not implemented"; false

lint: ## run static analysis
	@echo "Not implemented"; false

test: ## run all tests
	@echo "Not implemented"; false

container: ## build container
	@echo "Not implemented"; false


# Plumbing
# ###############
.PHONY: yyyyyyyyy


# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
