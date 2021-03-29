import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

const redisClient = await connect({
    hostname: Deno.env.get("REDIS_HOST") || "127.0.0.1",
    port:  Number(Deno.env.get("REDIS_PORT")) ||6379,
});

log.info(`Start redis connection - ping status : ${await redisClient.ping()}`);

export default redisClient;