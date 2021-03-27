import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import {APP_NAME, APP_VERSION} from "../config/config.ts";
import { LinkDatabaseRepository } from "../repository/link_db_repository.ts";
import Link from "../interface/Link.ts";

export class LinkController {
  private linkRepository: LinkDatabaseRepository;

  constructor() {
    console.log("initialize link repository");
    this.linkRepository = new LinkDatabaseRepository();
  }

  async hello({ response }: { params: {}; response: any }): Promise<void> {
    response.status = 200;
    response.body = {
      message: `Hello from: ${APP_NAME} -- ${APP_VERSION}`,
      connection_pool: `${Deno.env.get("DB_POOL_SIZE")}`
    };
  }

  async getAll({ params, response }: { params: {}; response: any }): Promise<void> {
    try {
      const result = await this.linkRepository.getAll();
      response.status = 200;
      response.body = result;
    } catch (error) {
      log.error(error);
      response.status = 400;
      response.body = {
        message: `Error: ${error}`,
      };
    }
  }

  async getByShort({ params, response}: { params: { short: string }; response: any; }): Promise<void> {
    try {
      const short = params.short;
      const link: Link = await this.linkRepository.getByShort(short);
      if (!link) {
        response.status = 404;
        response.body = {
          message: `Link not found`,
        };
        return;
      }
      const updateResult = await this.linkRepository.updateStatByShort(short);
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
  }

  async getStatByShort({params, response}: {params: { short: string }, response: any}): Promise<void> {
    try {
      const link: Link = await this.linkRepository.getStatByShort(params.short);
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
  }

  async create({ request, response }: { request: any; response: any }): Promise<void> {
    try {
      const body = await request.body().value;
      log.info(`Create link request : ${JSON.stringify(body)}`)
      if (!body.url) {
        log.error(`Error: Cannot create link : invalid body`)
        response.status = 400;
        response.body = {
          message: "Invalid body",
        };
        return;
      }
      const link = await this.linkRepository.create(body.url);
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
  }

}
