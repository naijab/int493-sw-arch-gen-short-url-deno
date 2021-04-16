FROM hayd/debian-deno

WORKDIR /usr/app
COPY . .

CMD [ "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "index.ts" ]
EXPOSE 80