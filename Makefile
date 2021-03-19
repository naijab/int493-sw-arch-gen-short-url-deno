install:
	@echo "URL Shortener ===> Installing Tools ..."
	curl -fsSL https://deno.land/x/install/install.sh | sh

install-docker:
	@echo "URL Shortener ===> Installing Docker ..."
	su - ${USER}
	sudo apt update
	sudo apt install make git
	sudo apt install apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
	sudo apt update
	sudo apt install docker-ce
	sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	sudo usermod -aG docker ${USER}
	su - ${USER}

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

stop-db-docker:
	@echo "URL Shortener ===> Cleaning Database with Docker ..."
	docker-compose -f docker-compose-db.yaml down

clean-db-docker:
	@echo "URL Shortener ===> Cleaning Database with Docker ..."
	docker-compose -f docker-compose-db.yaml down --volumes

build-binary:
	@echo "URL Shortener ===> Build Production App Binary..."
	deno compile --unstable --allow-net --allow-env --allow-read --output=out/app index.ts 

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
