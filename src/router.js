import Router from 'koa-router'
const router = new Router()

import Message from '../models/Message';



router.get('/', async (ctx, next) => {
  ctx.body = 'Hello'
})

router.get('/messages', async (ctx, next) => {
    // if (!ctx.body) return; // no content to return

    var message = new Message();
    console.log();

    ctx.body = message.getAllMessages();
})

export default router