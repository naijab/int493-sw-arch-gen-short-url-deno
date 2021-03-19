import client from "../config/db.ts";
import Link from "../interface/Link.ts";
import {HOSTNAME, TABLE} from "../config/config.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

export default {
    getAll: async () => {
        return await client.query(`SELECT * FROM ${TABLE.LINK}`);
    },
    getByShort: async ( { short }: Link) => {
        const result = await client.query(
            `SELECT * FROM ${TABLE.LINK} WHERE short = ? LIMIT 1`,
            [
                short
            ],
        );
        return result[0]
    },
    create: async ({ full }: Link) => {
        let genId = nanoid(6);
        const result = await client.query(
            `INSERT INTO ${TABLE.LINK} (short, full) VALUES (?, ?)`,
            [genId, full]
        );
        if (result.affectedRows == 0) {
            return Promise.reject("Cannot Create Link")
        }
        return { short: `${HOSTNAME}/l/${genId}` };
    },
    updateStatByShort: async ({ short }: Link) => {
        const result = await client.query(
            `UPDATE ${TABLE.LINK} SET count = count + 1 WHERE short = ?`,
            [
                short,
            ],
        );
        if (result.affectedRows == 0) {
            return Promise.reject("Cannot Update Count Link")
        }
        return result.affectedRows;
    }
}