import Router from "koa-router";
import { jwt } from "../middleware/jwt";

import {
  index,
  show,
  create,
  update,
  del,
} from "../controllers/NoteController";

export const router = new Router();
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET });

router.get("/api/v1/notes", jwtMiddleware, index);
router.post("/api/v1/notes", jwtMiddleware, create);
router.get("/api/v1/notes/:id", jwtMiddleware, show);
router.put("/api/v1/notes/:id", jwtMiddleware, update);
router.delete("/api/v1/notes/:id", jwtMiddleware, del);
