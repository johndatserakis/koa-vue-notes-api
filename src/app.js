import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';

const app = new Koa()

//For cors
app.use(cors())

//For managing body
app.use(bodyParser())

//For router
app.use(router.routes())
app.use(router.allowedMethods());

//Birds-eye processing
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        throw error;
    }
})

export default app;