set-env:
	@[ -f ./.env ] && true || cp env.example .env;

install:
	@pnpm install

test-unit: install
	@pnpm run test:unit

test-integration: install
	@pnpm run test:server:integration

build-run: set-env
	@docker-compose up --build -d

run-apps: set-env
	@docker-compose up -d

build-run-test: set-env install build-run test