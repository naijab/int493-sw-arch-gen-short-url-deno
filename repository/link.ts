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
    const resultExistShortCount = await client.query(
      `SELECT count FROM ${TABLE.COUNTER} WHERE id = ? LIMIT 1`,
      [short]
    );

    // Check if have exist count link
    let existsURL = resultExistShortCount[0];
    if (existsURL) {
      return existsURL;
    }

    // It not have any count link
    const result = await client.query(
      `INSERT INTO ${TABLE.COUNTER} (id, count) VALUES (?, ?)`,
      [short, 0]
    );
    if (result.affectedRows == 0) {
      return Promise.reject("Cannot Create Link");
    }

    const resultShortCount = await client.query(
      `SELECT count FROM ${TABLE.COUNTER} WHERE id = ? LIMIT 1`,
      [short]
    );
    return resultShortCount[0];
  },
  create: async ({ full }: Link) => {
    const resultFull = await client.query(
      `SELECT short, full FROM ${TABLE.LINK} WHERE full = ? LIMIT 1`,
      [full]
    );

    // Check if have exist full url
    let existsURL = resultFull[0];
    if (existsURL) {
      return { short: `${HOSTNAME}/l/${existsURL.short}` };
    }
    // It not have any full url
    let genId = nanoid(6);
    const result = await client.query(
      `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
      [genId, full]
    );
    if (result.affectedRows == 0) {
      return Promise.reject("Cannot Create Link");
    }
    return { short: `${HOSTNAME}/l/${genId}` };
  },
  updateStatByShort: async ({ short }: Link) => {
    const resultShort = await client.query(
      `SELECT id FROM ${TABLE.COUNTER} WHERE id = ? LIMIT 1`,
      [short]
    );

    // Check if have exist short url
    let existsURL = resultShort[0];
    if (existsURL) {
      const result = await client.query(
        `UPDATE ${TABLE.COUNTER} SET count = count + 1 WHERE id = ?`,
        [short]
      );
      if (result.affectedRows == 0) {
        return Promise.reject("Cannot Update Count Link");
      }
      return result.affectedRows;
    }
    // It not have any short url
    const result = await client.query(
      `INSERT INTO ${TABLE.COUNTER} (id, count) VALUES (?, ?)`,
      [short, 1]
    );
    if (result.affectedRows == 0) {
      return Promise.reject("Cannot Create Counter Link");
    }
    return result.affectedRows;
  },
};
