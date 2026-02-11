import { prisma } from '../db/client.js'

/**
 * Fetch order details by order number
 */
export async function fetchOrderDetails(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      user: {
        select: { name: true, email: true },
      },
    },
  })

  if (!order) {
    return {
      found: false,
      message: `Order ${orderNumber} not found. Please check the order number and try again.`,
    }
  }

  return {
    found: true,
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount.toString(),
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery?.toISOString().split('T')[0],
    createdAt: order.createdAt.toISOString().split('T')[0],
    items: order.items.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price.toString(),
    })),
    customerName: order.user.name,
  }
}

/**
 * Check delivery status for an order
 */
export async function checkDeliveryStatus(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      trackingNumber: true,
      estimatedDelivery: true,
      shippingAddress: true,
      updatedAt: true,
    },
  })

  if (!order) {
    return {
      found: false,
      message: `Order ${orderNumber} not found.`,
    }
  }

  const statusMessages: Record<string, string> = {
    pending: 'Your order is pending and will be processed soon.',
    processing: 'Your order is being prepared for shipment.',
    shipped: 'Your order has been shipped and is on its way.',
    delivered: 'Your order has been delivered.',
    cancelled: 'This order has been cancelled.',
  }

  return {
    found: true,
    orderNumber: order.orderNumber,
    status: order.status,
    statusMessage: statusMessages[order.status] || 'Status unknown',
    trackingNumber: order.trackingNumber || 'Not yet assigned',
    estimatedDelivery: order.estimatedDelivery?.toISOString().split('T')[0] || 'To be determined',
    shippingAddress: order.shippingAddress,
    lastUpdated: order.updatedAt.toISOString(),
  }
}

/**
 * Get order history for a user
 */
export async function getOrderHistory(userId: string, limit: number = 5) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      items: true,
    },
  })

  if (orders.length === 0) {
    return {
      found: false,
      message: 'No orders found for this user.',
    }
  }

  return {
    found: true,
    totalOrders: orders.length,
    orders: orders.map(order => ({
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount.toString(),
      itemCount: order.items.length,
      createdAt: order.createdAt.toISOString().split('T')[0],
      trackingNumber: order.trackingNumber,
    })),
  }
}

/**
 * Cancel an order (if eligible)
 */
export async function cancelOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  })

  if (!order) {
    return {
      success: false,
      message: `Order ${orderNumber} not found.`,
    }
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    return {
      success: false,
      message: `Cannot cancel order. Current status: ${order.status}`,
    }
  }

  if (order.status === 'shipped') {
    return {
      success: false,
      message: 'Order has already been shipped. Please initiate a return after delivery.',
    }
  }

  // Update order status
  await prisma.order.update({
    where: { orderNumber },
    data: { status: 'cancelled' },
  })

  return {
    success: true,
    message: `Order ${orderNumber} has been cancelled successfully. A refund will be processed within 5-7 business days.`,
    previousStatus: order.status,
    newStatus: 'cancelled',
  }
}
