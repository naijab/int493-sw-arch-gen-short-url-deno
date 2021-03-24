import { APP_NAME } from "../config/config.ts";
import linkRepository from "../repository/link.ts";
import Link from "../interface/Link.ts";
import Counter from "../interface/Counter.ts";

export default {
  hello: async ({ response }: { params: {}; response: any }) => {
    response.status = 200;
    response.body = {
      message: `Hello from: ${APP_NAME}`,
    };
  },
  getAll: async ({ params, response }: { params: {}; response: any }) => {
    try {
      const result = await linkRepository.getAll();
      response.status = 200;
      response.body = result;
    } catch (error) {
      console.error(error);
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
      if (updateResult > 0) {
        response.status = 302;
        response.headers.set("Location", link.full);
        return;
      }
    } catch (error) {
      console.error(error);
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
      const link: Link = await linkRepository.getByShort({
        short: params.short,
      });
      if (!link) {
        response.status = 404;
        response.body = {
          message: `Link not found`,
        };
        return;
      }
      const stat: Counter = await linkRepository.getStatByShort({
        short: params.short,
      });
      response.status = 200;
      response.body = {
        visit: stat.count,
      };
      return;
    } catch (error) {
      console.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  },
  create: async ({ request, response }: { request: any; response: any }) => {
    const body = await request.body().value;
    if (!body.url) {
      response.status = 400;
      response.body = {
        message: "Invalid body",
      };
      return;
    }
    try {
      const link = await linkRepository.create({
        full: body.url,
      });
      response.status = 200;
      response.body = {
        link: link.short,
      };
      return;
    } catch (error) {
      console.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  },
};
