# homework-2-deno

> URL Shortener API

## Must install

- docker, docker-compose, make
- `sudo apt install make` for install make

## How to run
- copy **.env.example** to **.env** and edit value and use `source .env`
- if database machine edit onlye `DB_PASSWORD` value for initialize database container

- run `make install` for installing deno
- run `make install-docker` for installing docker
- run `make start-db-docker` for starting database (only use on database machine) -- port 3307 default
- run `make start-app-docker` for starting app (only use on app machine) -- port 8080 default
- run `make lint` for linting of code
