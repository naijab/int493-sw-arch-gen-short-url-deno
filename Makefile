install:
	@echo "URL Shortener ===> Installing Tools ..."
	sudo apt install unzip
	curl -fsSL https://deno.land/x/install/install.sh | sh

install-docker:
	@echo "URL Shortener ===> Installing Docker ..."
	sudo apt update
	sudo apt install git -y
	sudo apt install apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
	sudo apt update
	sudo apt install docker-ce -y
	sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	sudo usermod -aG docker ${USER}
	su - ${USER}

clone:
	git clone 

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

start-app-docker:
	@echo "URL Shortener ===> Start App with Docker ..."
	docker-compose -f docker-compose-app.yaml up -d

status-app-docker:
	@echo "URL Shortener ===> Status of App with Docker ..."
	docker-compose -f docker-compose-app.yaml ps -a

stop-app-docker:
	@echo "URL Shortener ===> Stop App with Docker ..."
	docker-compose -f docker-compose-app.yaml down

start-db-docker:
	@echo "URL Shortener ===> Start Database with Docker ..."
	docker-compose -f docker-compose-db.yaml up -d

stop-db-docker:
	@echo "URL Shortener ===> Cleaning Database with Docker ..."
	docker-compose -f docker-compose-db.yaml down

status-db-docker:
	@echo "URL Shortener ===> Status of Database with Docker ..."
	docker-compose -f docker-compose-db.yaml ps -a

clean-db-docker:
	@echo "URL Shortener ===> Cleaning Database with Docker ..."
	docker-compose -f docker-compose-db.yaml down --volumes

build-binary:
	@echo "URL Shortener ===> Build Production App Binary..."
	mkdir -p out
	deno compile --unstable --allow-net --allow-env --allow-read --output=out/app index.ts 

enable-app-service:
	@echo "URL Shortener ===> Enable URL Service App for systemd..."
	sudo systemctl enable url-shortener.service

start-app-service:
	@echo "URL Shortener ===> Starting URL Service App for systemd..."
	sudo systemctl start url-shortener.service

status-app-service:
	@echo "URL Shortener ===> Status of URL Service App for systemd..."
	sudo systemctl status url-shortener.service

lint:
	@echo "URL Shortener ===> Check and Lint ..."
	deno lint --unstable
