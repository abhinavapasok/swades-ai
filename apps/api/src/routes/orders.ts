import { Hono } from 'hono'
import { OrderController } from '../controllers/orderController.js'

export const orderRoutes = new Hono()

orderRoutes.get('/', OrderController.listOrders)
orderRoutes.get('/:id', OrderController.getOrder)
