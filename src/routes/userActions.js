import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import UserActionController from '../controllers/UserActionController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

router.get('/', async (ctx, next) => {
    console.log(ctx.request.ip)
    ctx.body = { message: 'Hi there.', ctx: ctx.request.ip }
})

//Initial controller once for all routes
const userActionController = new UserActionController()

router.post('/api/v1/user/signup', async (ctx, next) => {
    await userActionController.signup(ctx)
})

router.post('/api/v1/user/authenticate', async (ctx, next) => {
    await userActionController.authenticate(ctx)
})

router.post('/api/v1/user/refreshAccessToken', async (ctx, next) => {
    await userActionController.refreshAccessToken(ctx)
})

router.post(
    '/api/v1/user/invalidateAllRefreshTokens',
    jwtMiddleware,
    async (ctx, next) => {
        await userActionController.invalidateAllRefreshTokens(ctx)
    }
)

router.post(
    '/api/v1/user/invalidateRefreshToken',
    jwtMiddleware,
    async (ctx, next) => {
        await userActionController.invalidateRefreshToken(ctx)
    }
)

router.post('/api/v1/user/forgot', async (ctx, next) => {
    await userActionController.forgot(ctx)
})

router.post('/api/v1/user/checkPasswordResetToken', async (ctx, next) => {
    await userActionController.checkPasswordResetToken(ctx)
})

router.post('/api/v1/user/resetPassword', async (ctx, next) => {
    await userActionController.resetPassword(ctx)
})

router.post('/api/v1/user/private', jwtMiddleware, async (ctx, next) => {
    await userActionController.private(ctx)
})

export default router
