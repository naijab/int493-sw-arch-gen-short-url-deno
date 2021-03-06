import "https://deno.land/x/dotenv/load.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import {DATABASE_NAME, TABLE} from "./config.ts";

const client = await new Client();

client.connect({
    hostname: Deno.env.get('DB_HOST'),
    db: DATABASE_NAME,
    username: Deno.env.get('DB_USERNAME'),
    password: Deno.env.get('DB_PASSWORD'),
    poolSize: Number(Deno.env.get('DB_POOL_SIZE')),
})

const run = async () => {
    // Create Database if not exist
    await client.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

    // Create link table if not exists
    await client.execute(`
        CREATE TABLE IF NOT EXISTS ${TABLE.LINK} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            short VARCHAR(10) NOT NULL,
            full TEXT NOT NULL,
            count INT(11) UNSIGNED NOT NULL DEFAULT 0,
            PRIMARY KEY (id),
            CONSTRAINT short_key UNIQUE (short)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `);
}

run();

export default client;