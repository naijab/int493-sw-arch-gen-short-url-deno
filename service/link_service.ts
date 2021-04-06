import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import Link from "../model/Link.ts";
import redis from "../config/redis.ts";
import { LinkDatabaseRepository } from "../repository/link_db_repository.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts"

export const LinkService = {

    create: async (fullUrl: string): Promise<Link | null> => {
        try {
            // Check full url is hash exist
            // const shortInCached = await redis.get(fullUrl);
            // if (shortInCached) {
            //     log.info(`[LinkService] -- [Create link by full] shortInCached : ${shortInCached}`);
            //     return await LinkService.getByShort(shortInCached);
            // }

            // Generate short url
            const short = nanoid(5);

            // Save to full url
            await redis.set(fullUrl, short);

            // Save to hash object
            await redis.hmset(short, {
                short: short,
                full: fullUrl,
                count: 0
            })

            return {
                short: short,
                full: fullUrl,
                count: 0,
            };
        } catch (e) {
            log.error(`[LinkService] -- [Create link by full] Error : ${e}`);
        }
        return null;
    },

    getAll: async (): Promise<[Link]> => {
        return await LinkDatabaseRepository.getAll();
    },

    getByShort: async (shortUrl: string): Promise<Link | null> => {
        try {
            const result = await redis.hmget(shortUrl, "short", "full", "count");
            if (result.length == 3) {
                const short = result[0];
                const full = result[1];
                const countRaw = result[2];

                if (short && full && countRaw) {
                    const countStr  = countRaw as string;
                    const count = Number(countStr);
                    return {
                        short,
                        full,
                        count,
                    }
                }
            }
            return null;
        } catch (e) {
            log.error(`[LinkService] -- [Get link by short] Error : ${e}`);
            return null;
        }
    },

    getStatByShort: async (shortUrl: string): Promise<Link | null> => {
        return await LinkService.getByShort(shortUrl);
    },

    updateStatByShort: async (link: Link): Promise<boolean> => {
        try {
            // Update count to hash object
            await redis.hincrby(link.short!, "count", 1);
            return true;
        } catch (e) {
            log.error(`[LinkService] -- [Update stat by short] Error: ${e}`);
        }
        return false;
    },

};
