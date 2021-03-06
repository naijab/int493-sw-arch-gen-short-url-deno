install:
	@echo "URL Shortener ===> Installing Tools ..."
	curl -fsSL https://deno.land/x/install/install.sh | sh
	sudo npm install -g pm2

start:
	@echo "URL Shortener ===> Dev App Starting ..."
	deno run --allow-net --allow-read --allow-env index.ts

start-docker:
	@echo "URL Shortener ===> Starting Production App with Docker ..."
	docker-compose up -d --build

status-docker:
	@echo "URL Shortener ===> Status Production App with Docker ..."
	docker-compose ps -a

stop-docker:
	@echo "URL Shortener ===> Stopping Production App with Docker ..."
	docker-compose down

clean-docker:
	@echo "URL Shortener ===> Cleaning Production App with Docker ..."
	rm -rf mariadb/

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
