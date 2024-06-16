set-env:
	@[ -f ./.env ] && true || cp env.example .env;

install:
	pnpm install

test-unit: install
	pnpm run test:unit

test-integration: install
	pnpm run test:server:integration

start-app: set-env
	docker compose -f docker-compose.dev.yml up

stop:
	docker compose -f docker-compose.dev.yml down