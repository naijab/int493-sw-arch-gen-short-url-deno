import client from "../config/db.ts";
import Link from "../interface/Link.ts";
import {DATABASE_NAME, HOSTNAME, TABLE} from "../config/config.ts";
import Count from "../interface/Count.ts";

const KEY = Deno.env.get('SHORT_PREFIX_KEY') || 'Pra'

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
    create: async ( { full }: Link) => {
        const countResult = await client.query(
            `SELECT AUTO_INCREMENT as count 
                    FROM INFORMATION_SCHEMA.TABLES 
                    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
            [
                DATABASE_NAME,
                TABLE.LINK
            ]);
        const count = countResult[0].count + 1 as Count
        const result = await client.query(
            `INSERT INTO ${TABLE.LINK} (short, full) VALUES (CONCAT(?, ?), ?)`,
            [
                KEY,
                count,
                full,
            ],
        )
        if (result.affectedRows == 0) {
            return Promise.reject("Cannot Create Link")
        }
        return {short: `${HOSTNAME}/l/${KEY}${count}`}
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