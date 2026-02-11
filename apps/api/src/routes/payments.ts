import { Hono } from 'hono'
import { PaymentController } from '../controllers/paymentController.js'

export const paymentRoutes = new Hono()

paymentRoutes.get('/', PaymentController.listPayments)
paymentRoutes.get('/:id', PaymentController.getPayment)
