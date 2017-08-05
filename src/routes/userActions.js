import Router from 'koa-router';
import jwt from '../middleware/jwt';
import logger from '../logs/log';

import UserActionController from '../controllers/UserActionController';

const router = new Router();
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET });

router.get('/', async (ctx, next) => {
    ctx.body = { message: 'Hi there.' };
});

router.post('/api/v1/user/signup', async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.signup(ctx);
});

router.post('/api/v1/user/authenticate', async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.authenticate(ctx);
});

router.post('/api/v1/user/refreshAccessToken', async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.refreshAccessToken(ctx);
});

router.post(
    '/api/v1/user/invalidateAllRefreshTokens',
    jwtMiddleware,
    async (ctx, next) => {
        const userActionController = new UserActionController();
        await userActionController.invalidateAllRefreshTokens(ctx);
    }
);

router.post(
    '/api/v1/user/invalidateRefreshToken',
    jwtMiddleware,
    async (ctx, next) => {
        const userActionController = new UserActionController();
        await userActionController.invalidateRefreshToken(ctx);
    }
);

router.post('/api/v1/user/forgot', async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.forgot(ctx);
});

router.post('/api/v1/user/checkPasswordResetToken', async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.checkPasswordResetToken(ctx);
});

router.post('/api/v1/user/resetPassword', async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.resetPassword(ctx);
});

router.post('/api/v1/user/private', jwtMiddleware, async (ctx, next) => {
    const userActionController = new UserActionController();
    await userActionController.private(ctx);
});

export default router;
