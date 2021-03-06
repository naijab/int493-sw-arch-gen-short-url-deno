install:
	@echo "URL Shortener ===> Installing Tools ..."
	curl -fsSL https://deno.land/x/install/install.sh | sh
	sudo npm install -g pm2

start:
	@echo "URL Shortener ===> Starting ..."
	deno run --allow-net --allow-read --allow-env index.ts

start-prod:
	@echo "URL Shortener ===> Starting Prod ..."
	pm2 start

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
