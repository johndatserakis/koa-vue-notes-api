import Koa from "koa"
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import userAgent from "koa-useragent";
import koaJsonError from "koa-json-error";
// import ratelimit from "koa-ratelimit";
// import redis from "ioredis";
import { logger } from "./logs/log";

// Routes
import { router as baseRouter } from "./routes/base";
import { router as userActionsRouter } from "./routes/user-actions";
import { router as notesRouter } from "./routes/notes";

// Initialize app
export const app = new Koa();

// Here's the rate limiter
// app.use(
//   ratelimit({
//     // eslint-disable-next-line new-cap
//     db: new redis(),
//     duration: 60000,
//     errorMessage:
//       "Hmm, you seem to be doing that a bit too much - wouldn't you say?",
//     id: (ctx) => ctx.ip,
//     headers: {
//       remaining: "Rate-Limit-Remaining",
//       reset: "Rate-Limit-Reset",
//       total: "Rate-Limit-Total",
//     },
//     max: 100,
//   }),
// );

// Let's log each successful interaction. We'll also log each error - but not here,
// that's be done in the json error-handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
    logger.info(`${ctx.method} ${ctx.url} RESPONSE: ${ctx.response.status}`);
  } catch (error) {
    //
  }
});

// Apply error json handling
const errorOptions = {
  postFormat: (e: any, obj: { stack: any; name: any; }) => {
    // Here's where we'll stick our error logger.
    logger.info(obj);
    if (process.env.NODE_ENV !== "production") {
      return obj;
    }
    delete obj.stack;
    delete obj.name;
    return obj;
  },
};
app.use(koaJsonError(errorOptions));

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
  const t1 = Date.now();
  await next();
  const t2 = Date.now();
  ctx.set("X-Response-Time", `${Math.ceil(t2 - t1)}ms`);
});

// For cors with options
app.use(cors({ origin: "*" }));

// For useragent detection
app.use(userAgent);

// For managing body. We're only allowing json.
app.use(bodyParser({ enableTypes: ["json"] }));

// For router
app.use(baseRouter.routes());
app.use(baseRouter.allowedMethods());
app.use(userActionsRouter.routes());
app.use(userActionsRouter.allowedMethods());
app.use(notesRouter.routes());
app.use(notesRouter.allowedMethods());
