import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import Link from "../model/Link.ts";
import redis from "../config/redis.ts";
import {LinkDatabaseRepository} from "../repository/link_db_repository.ts";


export const LinkService = {

    create: async (fullUrl: string): Promise<String | null> => {
        try {
            let isExistLink = await LinkDatabaseRepository.getByFull(fullUrl);
            if (isExistLink && isExistLink.short) {
                log.info(`[LinkService] -- [Create link by full] -- link exists : from db`);
                return isExistLink.short;
            }
            log.info(`[LinkService] -- [Create link by full] : from db`);
            return await LinkDatabaseRepository.createShortLink(fullUrl);
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
            if (cached) {
                log.info(`[LinkService] -- [Get link by short] : from redis`);
                link = JSON.parse(cached);
                return link;
            }
            log.info(`[LinkService] -- [Get link by short] : from db`);
            link = await LinkDatabaseRepository.getByShort(shortUrl);
            if (link){
                await redis.set(shortUrl, JSON.stringify(link));
            }
            return link;
        } catch (e) {
            log.error(`[LinkService] -- [Get link by short] Error : ${e}`);
            return null;
        }
    },

    updateStatByShort: async (link: Link): Promise<number> => {
        try {
            if (link && link.short != null) {
                await redis.del(link.short);
                return await LinkDatabaseRepository.updateStatByShort(link.short);
            }
        } catch (e) {
            log.error(`[LinkService] -- [Update stat by short] Error: ${e}`);
        }
        return 0;
    },

};
