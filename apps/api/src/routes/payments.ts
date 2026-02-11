import { Hono } from 'hono'
import { PaymentController } from '../controllers/paymentController.js'

const app = new Hono()

export const paymentRoutes = app
    .get('/', PaymentController.listPayments)
    .get('/:id', PaymentController.getPayment)
