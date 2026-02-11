import { Hono } from 'hono'
import { UserController } from '../controllers/userController.js'

const app = new Hono()

export const userRoutes = app
    .get('/', UserController.listUsers)
    .get('/:id', UserController.getUser)
