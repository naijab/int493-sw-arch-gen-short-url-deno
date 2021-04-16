import { Router } from "https://deno.land/x/oak/mod.ts";
import { LinkController } from "../controller/link-controller.ts";

const router = new Router();

router
  .get("/", LinkController.hello)
  .get("/l/:short", LinkController.getByShort)
  .get("/l/:short/stats", LinkController.getStatByShort)
  .post("/link", LinkController.create);

export const LinkRouter = router;
