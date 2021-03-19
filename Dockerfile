FROM hayd/alpine-deno:latest
EXPOSE 80
WORKDIR /usr/app
COPY . .
CMD [ "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "index.ts" ]