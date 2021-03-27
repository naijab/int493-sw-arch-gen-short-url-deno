import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import client from "../config/db.ts";
import Link from "../interface/Link.ts";
import { HOSTNAME, TABLE } from "../config/config.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";
import { ILinkRepository } from "./base/link_repository_base.ts";

export class LinkDatabaseRepository implements ILinkRepository {
  async create(fullUrl: string): Promise<Link | null> {
    try {
      log.info(`Create short link with full url: ${fullUrl}`);
      const result = await client.transaction(async (_) => {
        let genId = nanoid(6);
        try {
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
      log.error(`Error Create short link : ${e}`);
    }
    return null;
  }

  async getAll(): Promise<[Link]> {
    return await client.query(`SELECT * FROM ${TABLE.LINK}`);
  }

  async getByShort(shortUrl: string): Promise<Link> {
    const result = await client.query(
      `SELECT full FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [shortUrl],
    );
    return result[0];
  }

  async getStatByShort(shortUrl: string): Promise<Link> {
    const result = await client.query(
      `SELECT count FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
      [shortUrl],
    );
    return result[0];
  }

  async updateStatByShort(shortUrl: string): Promise<number> {
    const updateResult = await client.execute(
      `UPDATE ${TABLE.LINK} SET count = count + 1 WHERE short = ?`,
      [shortUrl],
    );
    let result = updateResult.affectedRows;
    if (!result || result == 0) {
      return Promise.reject("updateStatByShort -- Cannot Update Count Link");
    }
    return result;
  }
}
