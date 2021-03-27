import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import client from "../config/db.ts";
import Link from "../model/Link.ts";
import { HOSTNAME, TABLE } from "../config/config.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

export const LinkCacheRepository = {
  create: async (fullUrl: string): Promise<Link | null> => {
    // TODO: Implement connect to redis or key db get cached;
    return null;
  },

  getAll: async (): Promise<[Link]> => {
    // TODO: Implement connect to redis or key db get cached;
    return await client.query(`SELECT * FROM ${TABLE.LINK}`);
  },

  getByShort: async (shortUrl: string): Promise<Link> => {
    // TODO: Implement connect to redis or key db get cached;
    const result = await client.query(
      `SELECT full FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [shortUrl],
    );
    return result[0];
  },

  getStatByShor: async (shortUrl: string): Promise<Link> => {
    // TODO: Implement connect to redis or key db get cached;
    const result = await client.query(
      `SELECT count FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [shortUrl],
    );
    return result[0];
  },
};
