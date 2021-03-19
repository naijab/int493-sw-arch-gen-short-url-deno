import { Router } from "https://deno.land/x/oak/mod.ts";
import urlShortenerController from "../controller/urlShortener.ts";

const router = new Router();

router
    .get("/", urlShortenerController.hello)
    .get("/l", urlShortenerController.getAll)
    .get("/l/:short", urlShortenerController.getByShort)
    .get("/l/:short/stats", urlShortenerController.getStatByShort)
    .post("/link", urlShortenerController.create);

export default router;