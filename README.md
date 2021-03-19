# homework-2-deno

> URL Shortener API

## Must install

- docker, docker-compose
- `sudo apt install make`

## How to run
- copy **.env.example** to **.env** and edit value and use `source .env`

- run `make install` for installing deno for run app local (first time)

- run `make start` for starting dev app at
  [http://localhost:8080](http://localhost:8080) or port with you config .env

- run `make start-docker` for starting production app with docker at
  [http://localhost:8080](http://localhost:8080) or port with you config .env

- run `make lint` for linting of code
