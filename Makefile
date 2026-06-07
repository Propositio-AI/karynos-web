PROJECT := karynos-web
SERVICE := web
COMPOSE := docker compose

.PHONY: help up down restart logs ps shell lint lint-fix format format-check orval orval-watch ci

help:
	@echo "Available targets:"
	@echo "  make up           - Build and start containers in background"
	@echo "  make down         - Stop and remove containers"
	@echo "  make restart      - Restart application stack"
	@echo "  make logs         - Follow compose logs"
	@echo "  make ps           - Show running services"
	@echo "  make shell        - Open shell in app container"
	@echo "  make lint         - Run ESLint in container"
	@echo "  make lint-fix     - Run ESLint with --fix in container"
	@echo "  make format       - Run Prettier write in container"
	@echo "  make format-check - Run Prettier check in container"
	@echo "  make orval        - Generate API client with Orval in container"
	@echo "  make orval-watch  - Run Orval in watch mode in container"
	@echo "  make ci           - Run format-check and lint"

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

restart: down up

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

shell:
	$(COMPOSE) exec $(SERVICE) sh

lint:
	$(COMPOSE) exec $(SERVICE) npm run lint

lint-fix:
	$(COMPOSE) exec $(SERVICE) npm run lint:fix

format:
	$(COMPOSE) exec $(SERVICE) npm run format

format-check:
	$(COMPOSE) exec $(SERVICE) npm run format:check

orval:
	$(COMPOSE) exec $(SERVICE) npm run orval

orval-watch:
	$(COMPOSE) exec $(SERVICE) npm run orval:watch

ci: format-check lint
