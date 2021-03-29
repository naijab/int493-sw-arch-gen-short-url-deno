import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import client from "../config/db.ts";
import Link from "../model/Link.ts";
import { HOSTNAME, TABLE } from "../config/config.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts"

export const LinkDatabaseRepository = {
  create: async (fullUrl: string): Promise<Link | null> => {
    try {
      const result = await client.transaction(async (_) => {
        try {
          let genId = nanoid(6);
          await client.execute(
            `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
            [genId, fullUrl],
          );
        } catch (e) {
          log.error(e);
        }
        return await client.query(
          `SELECT short, full FROM ${TABLE.LINK} WHERE full = ? LIMIT 1`,
          [fullUrl],
        );
      });
      let url = result[0];
      log.info(`Create short link : [Shorted link] : ${JSON.stringify(url)}`);
      return { short: `${HOSTNAME}/l/${url.short}` };
    } catch (e) {
      log.error(`[LinkDBRepository] -- [Create link by full] Error : ${e}`);
    }
    return null;
  },

  getAll: async (): Promise<[Link]> => {
    return await client.query(`SELECT * FROM ${TABLE.LINK}`);
  },

  getByShort: async (shortUrl: string): Promise<Link> => {
    const result = await client.query(
      `SELECT * FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [shortUrl],
    );
    log.info(`result : ${result[0].count}`)
    return result[0];
  },

  getStatByShort: async (shortUrl: string): Promise<Link> => {
    const result = await client.query(
      `SELECT count FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [shortUrl],
    );
    return result[0];
  },

  updateStatByShort: async (shortUrl: string): Promise<number> => {
    const updateResult = await client.execute(
      `UPDATE ${TABLE.LINK} SET count = count + 1 WHERE short = ?`,
      [shortUrl],
    );
    let result = updateResult.affectedRows;
    if (!result || result == 0) {
      return Promise.reject("updateStatByShort -- Cannot Update Count Link");
    }
    return result;
  },
};
