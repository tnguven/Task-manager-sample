set-env:
	@[ -f ./.env ] && true || cp env.example .env;

install:
	@pnpm install

test: install
	pnpm run lint && \
	pnpm run test && \
	pnpm run e2e:headless

build-run: set-env
	docker-compose up --build -d

run-apps: set-env
	docker-compose up -d

build-run-test: set-env install build-run test