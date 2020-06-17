import Router from "koa-router";
import { jwt } from "../middleware/jwt";

import {
  signup,
  authenticate,
  refreshAccessToken,
  invalidateAllRefreshTokens,
  invalidateRefreshToken,
  forgot,
  checkPasswordResetToken,
  reset,
  privateArea,
} from "../controllers/user-action-controller";

export const router = new Router();
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET });

const baseUrl = "/api/v1";

router.post(`${baseUrl}/user/signup`, signup);
router.post(`${baseUrl}/user/authenticate`, authenticate);
router.post(`${baseUrl}/user/refreshAccessToken`, refreshAccessToken);
router.post(
  `${baseUrl}/user/invalidateAllRefreshTokens`,
  jwtMiddleware,
  invalidateAllRefreshTokens,
);
router.post(
  `${baseUrl}/user/invalidateRefreshToken`,
  jwtMiddleware,
  invalidateRefreshToken,
);
router.post(`${baseUrl}/user/forgot`, forgot);
router.post(`${baseUrl}/user/checkPasswordResetToken`, checkPasswordResetToken);
router.post(`${baseUrl}/user/reset`, reset);
router.post(`${baseUrl}/user/private`, jwtMiddleware, privateArea);
