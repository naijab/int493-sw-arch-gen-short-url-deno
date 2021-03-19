install:
	@echo "URL Shortener ===> Installing Tools ..."
	curl -fsSL https://deno.land/x/install/install.sh | sh

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
	sudo rm -rf mariadb/

start-db-docker:
	@echo "URL Shortener ===> Start Database with Docker ..."
	docker-compose -f docker-compose-db.yaml up -d

build-binary:
	@echo "URL Shortener ===> Build Production App Binary..."
	deno compile --unstable --allow-net --allow-env --allow-read --output=out/app index.ts 

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
