import Router from "koa-router";
import { format, parseISO } from "date-fns";
import db from "../db/db";

export const router = new Router();

const baseUrl = "/api/v1";

router.get(`${baseUrl}/`, (ctx) => {
  ctx.body = {
    data: { message: "Hi there.", version: process.env.IMAGE_TAG },
  };
});

router.get(`${baseUrl}/datetime`, (ctx) => {
  ctx.body = {
    data: { datetime: parseISO(format(new Date(), "yyyy-MM-dd HH:mm:ss")) },
  };
});

router.get(`${baseUrl}/health`, (ctx) => {
  ctx.body = {
    data: { version: process.env.IMAGE_TAG },
  };
});

router.get(`${baseUrl}/healthd`, async (ctx) => {
  try {
    const [result] = await db.raw("SELECT NOW() as currentTime");

    ctx.body = {
      data: {
        message: "SUCCESS",
        datetime: result[0].currentTime,
        version: process.env.IMAGE_TAG,
      },
    };
  } catch (error) {
    throw new Error("ERROR");
  }
});

router.get(`${baseUrl}/panic`, () => {
  throw new Error("panic");
});
