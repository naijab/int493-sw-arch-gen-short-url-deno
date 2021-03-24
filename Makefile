install-deno:
	@echo "🔥 URL Shortener ===> Installing Deno ..."
	sudo apt install unzip
	curl -fsSL https://deno.land/x/install/install.sh | sh

install-docker:
	@echo "🔥 URL Shortener ===> Installing Docker ..."
	sudo apt update
	sudo apt install git -y
	sudo apt install apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
	sudo apt update
	sudo apt install docker-ce -y
	sudo usermod -aG docker ${USER}
	su - ${USER}

install-docker-compose:
	@echo "🔥 URL Shortener ===> Installing Docker Compose ..."	
	sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose

start:
	@echo "🔥 URL Shortener ===> Dev App Starting ..."
	deno run --allow-net --allow-read --allow-env index.ts

build-app-docker:
	@echo "🔥 URL Shortener ===> Building App with Docker ..."
	docker-compose -f docker-compose-app.yaml up -d --build

start-app-docker:
	@echo "🔥 URL Shortener ===> Start App with Docker ..."
	docker-compose -f docker-compose-app.yaml up -d

status-app-docker:
	@echo "🔥 URL Shortener ===> Status of App with Docker ..."
	docker-compose -f docker-compose-app.yaml ps -a

stop-app-docker:
	@echo "🔥 URL Shortener ===> Stop App with Docker ..."
	docker-compose -f docker-compose-app.yaml down

build-db-docker:
	@echo "🔥 URL Shortener ===> Build Database with Docker ..."
	docker-compose -f docker-compose-db.yaml up -d --build

start-db-docker:
	@echo "🔥 URL Shortener ===> Start Database with Docker ..."
	docker-compose -f docker-compose-db.yaml up -d

stop-db-docker:
	@echo "🔥 URL Shortener ===> Cleaning Database with Docker ..."
	docker-compose -f docker-compose-db.yaml down

status-db-docker:
	@echo "🔥 URL Shortener ===> Status of Database with Docker ..."
	docker-compose -f docker-compose-db.yaml ps -a

clean-db-docker:
	@echo "🔥 URL Shortener ===> Cleaning Database with Docker ..."
	docker-compose -f docker-compose-db.yaml down --volumes

build-binary:
	@echo "🔥 URL Shortener ===> Build Production App Binary..."
	mkdir -p out
	deno compile --unstable --allow-net --allow-env --allow-read --output=out/app index.ts 

lint:
	@echo "🔥 URL Shortener ===> Check and Lint ..."
	deno lint --unstable
