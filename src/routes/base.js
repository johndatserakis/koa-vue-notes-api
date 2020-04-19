import Router from "koa-router";
import { format } from "date-fns";
import db from "../db/db";

export const router = new Router();

router.get("/", (ctx) => {
  ctx.body = {
    data: { message: "Hi there.", version: process.env.npm_package_version },
  };
});

router.get("/datetime", (ctx) => {
  ctx.body = {
    data: { datetime: format(new Date(), "YYYY-MM-DD HH:mm:ss") },
  };
});

router.get("/health", (ctx) => {
  ctx.body = {
    data: { version: process.env.npm_package_version },
  };
});

router.get("/healthd", async (ctx) => {
  try {
    const [result] = await db.raw("SELECT NOW() as currentTime");

    ctx.body = {
      data: {
        message: "SUCCESS",
        datetime: result[0].currentTime,
        version: process.env.npm_package_version,
      },
    };
  } catch (error) {
    throw new Error("ERROR");
  }
});

router.get("/panic", () => {
  throw new Error("panic");
});
