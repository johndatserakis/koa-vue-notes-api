import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import NoteController from '../controllers/NoteController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const noteController = new NoteController()

router.get('/api/v1/notes', jwtMiddleware, async (ctx, next) => {
    await noteController.index(ctx)
})

router.post('/api/v1/notes', jwtMiddleware, async (ctx, next) => {
    await noteController.create(ctx)
})

router.get('/api/v1/notes/:id', jwtMiddleware, async (ctx, next) => {
    await noteController.show(ctx)
})

router.put('/api/v1/notes/:id', jwtMiddleware, async (ctx, next) => {
    await noteController.update(ctx)
})

router.delete('/api/v1/notes/:id', jwtMiddleware, async (ctx, next) => {
    await noteController.delete(ctx)
})

export default router
