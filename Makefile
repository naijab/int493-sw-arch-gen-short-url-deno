install:
	@echo "URL Shortener ===> Installing Tools ..."
	curl -fsSL https://deno.land/x/install/install.sh | sh
	sudo npm install -g pm2

start:
	@echo "URL Shortener ===> Starting ..."
	deno run --allow-net --allow-read --allow-env index.ts

start-pm2:
	@echo "URL Shortener ===> Starting Prod ..."
	pm2 start

start-docker:
	@echo "URL Shortener ===> Starting Prod with Docker ..."
	docker-compose up -d --build

status-docker:
	@echo "URL Shortener ===> Status Prod with Docker ..."
	docker-compose ps -a

stop-docker:
	@echo "URL Shortener ===> Stopping Prod with Docker ..."
	docker-compose down

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
