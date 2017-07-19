import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';

//For .env file
import {} from 'dotenv/config';

//Initialize app
const app = new Koa()

//For cors
app.use(cors())

//For managing body
app.use(bodyParser())

//For router
app.use(router.routes())
app.use(router.allowedMethods());

//Birds-eye processing -- Is this even necessary?
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

export default app;