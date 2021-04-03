import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { APP_NAME, APP_VERSION, HOSTNAME } from "../config/config.ts";
import Link from "../model/Link.ts";
import { LinkService } from "../service/link_service.ts";

export const LinkController = {
  hello: async ({ response }: { params: {}; response: any }): Promise<void> => {
    response.status = 200;
    response.body = {
      message: `Hello from: ${APP_NAME} -- ${APP_VERSION}`,
      connection_pool: `${Deno.env.get("DB_POOL_SIZE")}`,
    };
  },

  getAll: async ({ response }: { response: any }): Promise<void> => {
    try {
      const result = await LinkService.getAll();
      response.status = 200;
      response.body = result;
    } catch (error) {
      log.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  },

  getByShort: async (
    { params, response }: { params: { short: string }; response: any },
  ): Promise<void> => {
    try {
      const short = params.short;
      const link: Link | null = await LinkService.getByShort(short);

      if (!link) {
        response.status = 404;
        response.body = {
          message: `Link not found`,
        };
        return;
      }
      const updateResult = await LinkService.updateStatByShort(link);
      if (updateResult && updateResult > 0) {
        response.status = 302;
        response.headers.set("Location", link.full);
        return;
      }
    } catch (error) {
      log.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  },

  getStatByShort: async (
    { params, response }: { params: { short: string }; response: any },
  ): Promise<void> => {
    try {
      const short = params.short;
      const link: Link | null = await LinkService.getByShort(short);
      if (!link) {
        response.status = 404;
        response.body = {
          message: `Link not found`,
        };
        return;
      }
      response.status = 200;
      response.body = {
        visit: link.count,
      };
      return;
    } catch (error) {
      log.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  },

  create: async (
    { request, response }: { request: any; response: any },
  ): Promise<void> => {
    try {
      const body = await request.body().value;
      log.info(`Create link request : ${JSON.stringify(body)}`);
      if (!body.url) {
        log.error(`Error: Cannot create link : invalid body`);
        response.status = 400;
        response.body = {
          message: "Invalid body",
        };
        return;
      }

      const link: Link | null = await LinkService.create(body.url);
      if (!link) {
        let err = `Error: Cannot create link`;
        log.error(err);
        response.status = 400;
        response.body = {
          message: err,
        };
        return;
      }
      response.status = 200;
      response.body = {
        link: `${HOSTNAME}/l/${link.id}`,
      };
      return;
    } catch (error) {
      log.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  },
};
