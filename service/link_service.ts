import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import Link from "../model/Link.ts";
import redis from "../config/redis.ts";
import { LinkDatabaseRepository } from "../repository/link_db_repository.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts"

export const LinkService = {

    create: async (fullUrl: string): Promise<Link | null> => {
        try {
            let link: Link | null;
            const shortInCached = await redis.get(fullUrl);
            if (shortInCached) {
                const cached = await redis.get(shortInCached);
                if (cached) {
                    link = JSON.parse(cached);
                    return link;
                }
            }
            const short = nanoid(5);
            const newLink: Link = {
                short: short,
                full: fullUrl,
                count: 0
            };
            await redis.set(fullUrl, short);
            await redis.set(short, JSON.stringify(newLink));
            return newLink;
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
            let link: Link | null
            const cached = await redis.get(shortUrl);
            log.info(`Link in redis : ${JSON.stringify(cached)}`);
            if (cached) {
                log.info(`[LinkService] -- [Get link by short] : from redis`);
                link = JSON.parse(cached);
                return link;
            }
            return null;
        } catch (e) {
            log.error(`[LinkService] -- [Get link by short] Error : ${e}`);
            return null;
        }
    },

    getStatByShort: async (shortUrl: string): Promise<Link | null> => {
        try {
            let link: Link | null
            const cached = await redis.get(shortUrl);
            if (cached) {
                link = JSON.parse(cached);
                if (link) {
                    const linkInDb = await LinkDatabaseRepository.getByShort(link.short!);
                    if (linkInDb == null) {
                        await LinkDatabaseRepository.createShortLink(link.short!, link.full!);
                    }
                    await LinkDatabaseRepository.updateStatByShort(link.count!, link.short!);
                }
                return link;
            }
            return null;
        } catch (e) {
            log.error(`[LinkService] -- [Get link by short] Error : ${e}`);
            return null;
        }
    },

    updateStatByShort: async (link: Link): Promise<boolean> => {
        try {
            link.count! += 1;
            log.info(`Update stat --- ${JSON.stringify(link)}`);
            await redis.set(link.short!, JSON.stringify(link))
            return true;
        } catch (e) {
            log.error(`[LinkService] -- [Update stat by short] Error: ${e}`);
        }
        return false;
    },

};
