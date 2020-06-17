import { Context } from "koa"
import jsonwebtoken from "jsonwebtoken";

export const jwt = (opts: {secret?: any} = {}) => {
  const { secret } = opts;

  function getJwtToken(ctx: Context) {
    if (!ctx.header || !ctx.header.authorization) {
      return;
    }

    const parts = ctx.header.authorization.split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        return credentials;
      }
    }
    return ctx.throw(401, {
      error: { code: 401, message: "AUTHENTICATION_ERROR" },
    });
  }

  return (ctx: Context, next: Function) => {
    // If there's no secret set, toss it out right away
    if (!secret) ctx.throw(401, "INVALID_SECRET");

    // Grab the token
    const token = getJwtToken(ctx);

    try {
      type decodedWithUser = {
        data?: any
      }

      // Try and decode the token asynchronously
      // This is dirty now that it's converted to TypeScript
      const decoded: decodedWithUser = jsonwebtoken.verify(token, process.env.JWT_SECRET!) as object;

      // If it worked set the ctx.state.user parameter to the decoded token.
      ctx.state.user = decoded.data;
    } catch (error) {
      // If it's an expiration error, let's report that specifically.
      if (error.name === "TokenExpiredError") {
        ctx.throw(401, { error: { code: 401, message: "TOKEN_EXPIRED" } });
      } else {
        ctx.throw(401, {
          error: { code: 401, message: "AUTHENTICATION_ERROR" },
        });
      }
    }

    return next();
  };
};
