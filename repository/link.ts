import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import client from "../config/db.ts";
import Link from "../interface/Link.ts";
import { HOSTNAME, TABLE } from "../config/config.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

export default {
  getAll: async () => {
    return await client.query(`SELECT * FROM ${TABLE.LINK}`);
  },
  getByShort: async ({ short }: Link) => {
    const result = await client.query(
      `SELECT full FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [short]
    );
    return result[0];
  },
  getStatByShort: async ({ short }: Link) => {
    const result = await client.query(
      `SELECT count FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [short]
    );
    return result[0];
  },
  create: async ({ full }: Link): Promise<Link|null> => {
    try {
      const result = await client.transaction(async (_) => {
        let genId = nanoid(6);
        try {
          await client.execute(
              `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
              [genId, full]
          );
        } catch (e) {
          log.error(e);
        }
        return await client.query(
            `SELECT short, full FROM ${TABLE.LINK} WHERE full = ? LIMIT 1`,
            [full]
        );
      });
      let url = result[0];
      log.info(`Create short link : [Shorted link] : ${url}`)
      return { short: `${HOSTNAME}/l/${url.short}` };
    } catch (e) {
      log.error(`Error Create short link : ${e}`)
    }
    return null;
  },
  updateStatByShort: async ({ short }: Link) => {
    const updateResult = await client.execute(
      `UPDATE ${TABLE.LINK} SET count = count + 1 WHERE short = ?`,
      [short]
    );
    if (updateResult.affectedRows == 0) {
      return Promise.reject("updateStatByShort -- Cannot Update Count Link");
    }
    return updateResult.affectedRows;
  },
};
