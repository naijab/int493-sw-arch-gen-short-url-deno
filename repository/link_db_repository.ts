import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import client from "../config/db.ts";
import Link from "../model/Link.ts";

import { nanoid } from "https://deno.land/x/nanoid/mod.ts"
import {TABLE} from "../config/config.ts";

export const LinkDatabaseRepository = {
  createShortLink: async (fullUrl: string): Promise<String | null> => {
    try {
      let genId = nanoid(6);
      await client.execute(
          `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
          [genId, fullUrl],
      );
      return genId;
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
