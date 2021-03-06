install:
	@echo "URL Shortener ===> Installing Tools ..."
	curl -fsSL https://deno.land/x/install/install.sh | sh

start:
	@echo "URL Shortener ===> Starting ..."
	deno run --allow-net --allow-read --allow-env index.ts

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
