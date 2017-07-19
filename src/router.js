import Router from 'koa-router'
const router = new Router()

import Message from '../models/Message';

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello'
})

router.get('/messages', async (ctx, next) => {
    var message = new Message();
    ctx.body = await message.getAllMessages();
})

export default router;