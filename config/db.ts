import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { DATABASE_NAME, TABLE } from "./config.ts";
const client = await new Client();

client.connect({
  hostname: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT")) || 3306,
  db: DATABASE_NAME,
  username: Deno.env.get("DB_USERNAME"),
  password: Deno.env.get("DB_PASSWORD"),
  poolSize: Number(Deno.env.get("DB_POOL_SIZE")),
});

const run = async () => {
  log.info("start run script create table if not exist...");

  // Create Database if not exist
  await client.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

  // Create link table if not exists
  await client.execute(`
        CREATE TABLE IF NOT EXISTS ${TABLE.LINK} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            full VARCHAR(180) NOT NULL,
            count INT(11) UNSIGNED NOT NULL DEFAULT 0,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `);

  log.info("run script create table if not exist completed...");
};

run();

export default client;
