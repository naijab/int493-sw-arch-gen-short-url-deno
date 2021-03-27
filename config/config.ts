import "https://deno.land/x/dotenv/load.ts";

let host = Deno.env.get("HOST");
let port = Deno.env.get("PORT");

let hostName = port == "80" ? host : `${host}:${port}`;

export const APP_NAME = Deno.env.get("APP_NAME");
export const APP_VERSION = "v.1.0";
export const HOSTNAME = `${hostName}` || "http://localhost";

export const DATABASE_NAME = "project";
export const TABLE = {
  LINK: "link",
  COUNTER: "counter",
};
