import { Hono } from 'hono'
import { UserController } from '../controllers/userController.js'

export const userRoutes = new Hono()

userRoutes.get('/', UserController.listUsers)
userRoutes.get('/:id', UserController.getUser)
