import "https://deno.land/x/dotenv/load.ts";
import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import { APP_NAME, APP_VERSION } from "../config/config.ts";
import linkRepository from "../repository/link.ts";
import Link from "../interface/Link.ts";
import Counter from "../interface/Counter.ts";

export default {
  hello: async ({ response }: { params: {}; response: any }) => {
    response.status = 200;
    response.body = {
      message: `Hello from: ${APP_NAME} -- version ${APP_VERSION}`,
      connection_pool: `${Deno.env.get("DB_POOL_SIZE")}`
    };
  },
  getAll: async ({ params, response }: { params: {}; response: any }) => {
    try {
      const result = await linkRepository.getAll();
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
  getByShort: async ({
    params,
    response,
  }: {
    params: { short: string };
    response: any;
  }) => {
    try {
      const short = params.short;
      const link: Link = await linkRepository.getByShort({ short });
      if (!link) {
        response.status = 404;
        response.body = {
          message: `Link not found`,
        };
        return;
      }
      const updateResult = await linkRepository.updateStatByShort({ short });
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
  getStatByShort: async ({
    params,
    response,
  }: {
    params: { short: string };
    response: any;
  }) => {
    try {
      const link: Counter = await linkRepository.getStatByShort({
        short: params.short,
      });
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
  create: async ({ request, response }: { request: any; response: any }) => {

    try {
      const body = await request.body().value;
      if (!body.url) {
        log.error(`Error: Cannot create link : Invalid body`);
        response.status = 400;
        response.body = {
          message: "Invalid body",
        };
        return;
      }
      const link = await linkRepository.create({
        full: body.url,
      });
      if (!link) {
        let err = `Error: Cannot create link : ${body.link}`;
        log.error(err);
        response.status = 400;
        response.body = {
          message: err,
        };
        return;
      }
      response.status = 200;
      response.body = {
        link: link.short,
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
