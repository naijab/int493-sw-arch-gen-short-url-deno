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
      `SELECT full, count FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [short]
    );
    await client.close();
    return result[0];
  },
  getStatByShort: async ({ short }: Link) => {
    const result = await client.query(
      `SELECT count FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [short]
    );
    await client.close();
    return result[0];
  },
  create: async ({ full }: Link) => {
    const resultFull = await client.query(
      `SELECT short, full FROM ${TABLE.LINK} WHERE full = ? LIMIT 1`,
      [full]
    );

    // Check if have exist full url
    let existsURL = resultFull[0];
    if (existsURL) {
      await client.close();
      return { short: `${HOSTNAME}/l/${existsURL.short}` };
    }
    // It not have any full url
    let genId = nanoid(6);
    const insertResult = await client.execute(
      `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
      [genId, full]
    );
    await client.close();
    if (insertResult.affectedRows == 0) {
      return Promise.reject("create -- Cannot Create Link");
    }
    return { short: `${HOSTNAME}/l/${genId}` };
  },
  updateStatByShort: async ({ short }: Link) => {
    const updateResult = await client.execute(
      `UPDATE ${TABLE.LINK} SET count = count + 1 WHERE short = ?`,
      [short]
    );
    await client.close();
    if (updateResult.affectedRows == 0) {
      return Promise.reject("updateStatByShort -- Cannot Update Count Link");
    }
    return updateResult.affectedRows;
  },
};
