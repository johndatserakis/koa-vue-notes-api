import Router from 'koa-router'
import User from '../models/User'
import dateFormat from 'date-fns/format'
import jwt from '../middleware/jwt'
import logger from './log'

const router = new Router()
const jwtMiddleware = jwt({secret: process.env.JWT_SECRET})

router.get('/', async (ctx, next) => {
    ctx.body = {'message': 'Hi there.'}
})

router.post('/api/v1/user/signup', async (ctx, next) => {
    const user = new User()
    await user.signup(ctx)
})

router.post('/api/v1/user/authenticate', async (ctx, next) => {
    const user = new User()
    await user.authenticate(ctx)
})

router.post('/api/v1/user/refreshAccessToken', async (ctx, next) => {
    const user = new User()
    await user.refreshAccessToken(ctx)
})

router.post('/api/v1/user/invalidateAllRefreshTokens', jwtMiddleware, async (ctx, next) => {
    const user = new User()
    await user.invalidateAllRefreshTokens(ctx)
})

router.post('/api/v1/user/invalidateRefreshToken', jwtMiddleware, async (ctx, next) => {
    const user = new User()
    await user.invalidateRefreshToken(ctx)
})

router.post('/api/v1/user/forgot', async (ctx, next) => {
    const user = new User()
    await user.forgot(ctx)
})

router.post('/api/v1/user/checkPasswordResetToken', async (ctx, next) => {
    const user = new User()
    await user.checkPasswordResetToken(ctx)
})





router.post('/api/v1/user/private', jwtMiddleware, async (ctx, next) => {
    const user = new User()
    await user.private(ctx)
})

// router.get('/api/v1/user/getAllUsers', async (ctx, next) => {
//     const user = new User()
//     await user.getAllUsers(ctx)
// })

// router.get('/api/v1/user/getUser', async (ctx, next) => {
//     const user = new User()
//     await user.getUser(ctx)
// })

export default router