import { Hono } from 'hono'
import { OrderController } from '../controllers/orderController.js'

const app = new Hono()

export const orderRoutes = app
    .get('/', OrderController.listOrders)
    .get('/:id', OrderController.getOrder)
