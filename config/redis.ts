import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

const hostname = Deno.env.get("REDIS_HOST") || "127.0.0.1";
const port = Number(Deno.env.get("REDIS_PORT")) || 6379;

const redis = await connect({
  hostname,
  port,
});

// All Node Port
await redis.clusterMeet(hostname, 7001);
await redis.clusterMeet(hostname, 7002);
await redis.clusterMeet(hostname, 7003);
await redis.clusterMeet(hostname, 7004);
await redis.clusterMeet(hostname, 7005);

log.info(`Start redis connection - ping status : ${await redis.ping()}`);

const clusterNode = await redis.clusterNodes();
log.info(`Redis cluster : ${JSON.stringify(clusterNode)}`);

export default redis;