import Router from 'koa-router';
import dateFormat from 'date-fns/format';
import jwt from '../middleware/jwt';
import logger from './log';

import UserAction from '../models/UserAction';
import Note from '../models/Note';

const router = new Router();
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET });

//User

router.get('/', async (ctx, next) => {
    ctx.body = { message: 'Hi there.' };
});

router.post('/api/v1/user/signup', async (ctx, next) => {
    const user = new UserAction();
    await user.signup(ctx);
});

router.post('/api/v1/user/authenticate', async (ctx, next) => {
    const user = new UserAction();
    await user.authenticate(ctx);
});

router.post('/api/v1/user/refreshAccessToken', async (ctx, next) => {
    const user = new UserAction();
    await user.refreshAccessToken(ctx);
});

router.post(
    '/api/v1/user/invalidateAllRefreshTokens',
    jwtMiddleware,
    async (ctx, next) => {
        const user = new UserAction();
        await user.invalidateAllRefreshTokens(ctx);
    }
);

router.post(
    '/api/v1/user/invalidateRefreshToken',
    jwtMiddleware,
    async (ctx, next) => {
        const user = new UserAction();
        await user.invalidateRefreshToken(ctx);
    }
);

router.post('/api/v1/user/forgot', async (ctx, next) => {
    const user = new UserAction();
    await user.forgot(ctx);
});

router.post('/api/v1/user/checkPasswordResetToken', async (ctx, next) => {
    const user = new UserAction();
    await user.checkPasswordResetToken(ctx);
});

router.post('/api/v1/user/resetPassword', async (ctx, next) => {
    const user = new UserAction();
    await user.resetPassword(ctx);
});

router.post('/api/v1/user/private', jwtMiddleware, async (ctx, next) => {
    const user = new UserAction();
    await user.private(ctx);
});

//Notes

router.post('/api/v1/notes', jwtMiddleware, async (ctx, next) => {
    const note = new Note();
    await note.index(ctx);
});

export default router;
