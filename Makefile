include .env.prod
export $(shell sed 's/=.*//' .env.prod)

CONTEXT_NAME=mauroserver
DEFAULT_CONTEXT=desktop-linux
COMPOSE_APP_NAME=app

SSH_USER = root
SSH_HOST = mauro
SSH_DEST = /root/arandu

prune-builder-context:
	docker builder prune -f

init:
	# First you need to setup server ssh config with key
	docker context create $(CONTEXT_NAME) --docker "host=ssh://$(SSH_HOST)"

build:
	npm run generate
	rm -Rf build
	npm run build
	mkdir build/prisma
	cp prisma/schema.prisma build/prisma/schema.prisma
	cp package.json ./build/package.json
	cp package-lock.json ./build/package-lock.json
	
upload:
	$(MAKE) build -B
	docker context use $(CONTEXT_NAME)
	docker compose --env-file deploy.config build $(COMPOSE_APP_NAME) --no-cache
	docker context use $(DEFAULT_CONTEXT)

start-from-local:
	docker context use $(CONTEXT_NAME)
	docker compose --env-file deploy.config up -d
	docker context use $(DEFAULT_CONTEXT)
down-from-local:
	docker context use $(CONTEXT_NAME)
	docker compose --env-file deploy.config down
	docker context use $(DEFAULT_CONTEXT)
stop-from-local:
	docker context use $(CONTEXT_NAME)
	docker compose --env-file deploy.config stop
	docker context use $(DEFAULT_CONTEXT)
