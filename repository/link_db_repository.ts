import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import client from "../config/db.ts";
import Link from "../model/Link.ts";
import { TABLE } from "../config/config.ts";

export const LinkDatabaseRepository = {
  createShortLink: async (shortUrl: string, fullUrl: string): Promise<String | null> => {
    try {
      await client.execute(
        `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
        [shortUrl, fullUrl],
      );
      return shortUrl;
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
    return result[0];
  },

  updateStatByShort: async (count: number, shortUrl: string): Promise<number> => {
    const updateResult = await client.execute(
      `UPDATE ${TABLE.LINK} SET count = ? WHERE short = ?`,
      [count, shortUrl],
    );
    let result = updateResult.affectedRows;
    if (!result || result == 0) {
      return Promise.reject("updateStatByShort -- Cannot Update Count Link");
    }
    return result;
  },
};
