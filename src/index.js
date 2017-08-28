'use strict'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'
import logger from './logs/log'
import userAgent from 'koa-useragent'
import error from 'koa-json-error'
import ratelimit from 'koa-ratelimit'
import redis from 'ioredis'

//Routes
import userActionsRouter from './routes/userActions'
import notesRouter from './routes/notes'

//Initialize app
const app = new Koa()

//Here's the rate limiter
app.use(
    ratelimit({
        db: new redis(),
        duration: 60000,
        errorMessage:
            "Hmm, you seem to be doing that a bit too much - wouldn't you say?",
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 100,
    })
)

//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(async (ctx, next) => {
    try {
        await next()
        logger.info(
            ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status
        )
    } catch (error) {}
})

//Apply error json handling
let errorOptions = {
    postFormat: (e, obj) => {
        //Here's where we'll stick our error logger.
        logger.info(obj)
        if (process.env.NODE_ENV !== 'production') {
            return obj
        } else {
            delete obj.stack
            delete obj.name
            return obj
        }
    },
}
app.use(error(errorOptions))

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now()
    await next()
    const t2 = Date.now()
    ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')
})

//For cors with options
app.use(cors({ origin: '*' }))

//For useragent detection
app.use(userAgent)

//For managing body. We're only allowing json.
app.use(bodyParser({ enableTypes: ['json'] }))

//For router
app.use(userActionsRouter.routes())
app.use(userActionsRouter.allowedMethods())
app.use(notesRouter.routes())
app.use(notesRouter.allowedMethods())

export default app
