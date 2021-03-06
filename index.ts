import "https://deno.land/x/dotenv/load.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import logger from "./middleware/logger.ts";
import notFoundMiddleWare from "./middleware/notFound.ts";
import urlShortenerRoute from "./route/urlShortener.ts";

const app = new Application();
const port: number = Number(Deno.env.get('PORT')) || 8080;

// Logger Middleware
app.use(logger.logger);
app.use(logger.responseTime);

// Register Router
app.use(urlShortenerRoute.routes())
app.use(urlShortenerRoute.allowedMethods());

// 404 Route
app.use(notFoundMiddleWare);

// Error Listening
app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

// Request Listening
app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(
      `${yellow("Listening on:")} ${green(url)}`,
  );
});

await app.listen({ port: port });
