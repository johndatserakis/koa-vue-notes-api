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

const baseUrl = "/api/v1";

router.get(`${baseUrl}/notes`, jwtMiddleware, index);
router.post(`${baseUrl}/notes`, jwtMiddleware, create);
router.get(`${baseUrl}/notes/:id`, jwtMiddleware, show);
router.put(`${baseUrl}/notes/:id`, jwtMiddleware, update);
router.delete(`${baseUrl}/notes/:id`, jwtMiddleware, del);
