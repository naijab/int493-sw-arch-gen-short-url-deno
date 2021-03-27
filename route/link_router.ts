import { Router } from "https://deno.land/x/oak/mod.ts";
import { LinkController } from "../controller/link-controller.ts";

const router = new Router();
const controller = new LinkController();

router
  .get("/", controller.hello)
  .get("/l", controller.getAll)
  .get("/l/:short", controller.getByShort)
  .get("/l/:short/stats", controller.getStatByShort)
  .post("/link", controller.create);

export const LinkRouter = router;
