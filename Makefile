# Wisdom House frontend developer interface.
# Run `make help` to discover the supported workflows.

SHELL := /bin/sh
.DEFAULT_GOAL := help

APP_NAME ?= wisdom-house-frontend
PORT ?= 2000
HOST ?= 0.0.0.0
IMAGE ?= $(APP_NAME)
TAG ?= local
COMPOSE ?= docker compose
ENV_FILE ?= .env.local

export NEXT_TELEMETRY_DISABLED := 1

.PHONY: help setup install dev build start preview architecture typecheck lint lint-fix format format-fix \
	check ci media media-dry clean doctor env docker-dev docker-prod docker-build \
	docker-down docker-logs docker-ps

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "\nUsage: make <target> [PORT=2000]\n\n"} /^[a-zA-Z0-9_-]+:.*## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: env install ## Prepare a new local checkout

install: ## Install exact dependencies from package-lock.json
	npm ci

env: ## Create .env.local from the safe example when missing
	@if [ -f "$(ENV_FILE)" ]; then \
		echo "$(ENV_FILE) already exists"; \
	else \
		cp .env.example "$(ENV_FILE)"; \
		echo "Created $(ENV_FILE); review its values before production use"; \
	fi

dev: ## Start the local development server with hot reload
	npm run dev -- --hostname $(HOST) --port $(PORT)

build: ## Create an optimized production build
	NODE_ENV=production npm run build

start: ## Run an existing production build
	NODE_ENV=production npm run start -- --hostname $(HOST) --port $(PORT)

preview: build start ## Build and run locally in production mode

architecture: ## Enforce repository structure and module boundaries
	npm run architecture:check

typecheck: ## Run the TypeScript compiler without emitting files
	npm run type-check

lint: ## Check code quality
	npm run lint

lint-fix: ## Automatically fix safe lint violations
	npm run lint:fix

format: ## Check formatting without changing files
	npm run prettier

format-fix: ## Format project files
	npm run prettier:fix

check: architecture typecheck lint format ## Run fast local quality checks

ci: install check build ## Reproduce the full clean CI validation locally

media: ## Optimize media assets
	npm run media:optimize

media-dry: ## Preview media optimization without writing files
	npm run media:optimize:dry

clean: ## Remove generated build and tool caches (dependencies are preserved)
	rm -rf .next .next-prepush .cache/eslint tsconfig.tsbuildinfo

doctor: ## Verify the required local development tools
	@command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js is not installed"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "ERROR: npm is not installed"; exit 1; }
	@node_major=$$(node -p "Number(process.versions.node.split('.')[0])"); \
		[ "$$node_major" -ge 20 ] || { echo "ERROR: Node.js 20+ is required (found $$(node --version))"; exit 1; }
	@echo "Node $$(node --version), npm $$(npm --version)"
	@if command -v docker >/dev/null 2>&1; then docker --version; else echo "Docker: not installed (optional)"; fi

docker-dev: ## Start the containerized development server
	PORT=$(PORT) $(COMPOSE) --profile dev up --build frontend-dev

docker-prod: ## Build and start the production container
	PORT=$(PORT) $(COMPOSE) --profile prod up --build -d frontend-prod
	@echo "Production preview: http://localhost:$(PORT)"

docker-build: ## Build a tagged production image
	docker build --target production --tag $(IMAGE):$(TAG) .

docker-down: ## Stop and remove Compose containers (volumes are preserved)
	$(COMPOSE) --profile dev --profile prod down

docker-logs: ## Follow logs; set SERVICE=frontend-prod to override
	$(COMPOSE) --profile dev --profile prod logs --follow $(or $(SERVICE),frontend-dev)

docker-ps: ## Show Compose service status
	$(COMPOSE) --profile dev --profile prod ps
