import "https://deno.land/x/dotenv/load.ts";
import * as log from "https://deno.land/std@0.91.0/log/mod.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { LoggerMiddleware } from "./middleware/logger_middleware.ts";
import { NotFoundMiddleware } from "./middleware/not_found_middleware.ts";
import { LinkRouter } from "./route/link_router.ts";

const app = new Application();
const port: number = Number(Deno.env.get("PORT")) || 8080;

// Logger Middleware
app.use(LoggerMiddleware.logger);
app.use(LoggerMiddleware.responseTime);

// Register Router
app.use(LinkRouter.routes());
app.use(LinkRouter.allowedMethods());

// 404 Route
app.use(NotFoundMiddleware);

// Error Listening
app.addEventListener("error", (evt) => {
  log.error(evt.error);
});

// Request Listening
app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  log.info(`${yellow("Listening on:")} ${green(url)}`);
});

await app.listen({ port: port });
