import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  // First create the demo user with a fixed ID for the frontend
  const demoUser = await prisma.user.create({
    data: {
      id: 'demo-user-001',
      email: 'demo@swadesai.com',
      name: 'Demo User',
    },
  })

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
      },
    }),
    prisma.user.create({
      data: {
        email: 'alice.johnson@example.com',
        name: 'Alice Johnson',
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie.brown@example.com',
        name: 'Charlie Brown',
      },
    }),
  ])

  console.log(`✅ Created ${users.length + 1} users (including demo user)`)

  // Create Orders with Items
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[0].id,
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        totalAmount: 299.99,
        shippingAddress: '123 Main St, New York, NY 10001',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date('2024-01-15'),
        items: {
          create: [
            { productName: 'Wireless Headphones', quantity: 1, price: 199.99 },
            { productName: 'Phone Case', quantity: 2, price: 50.00 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[0].id,
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        totalAmount: 549.99,
        shippingAddress: '123 Main St, New York, NY 10001',
        trackingNumber: 'TRK987654321',
        estimatedDelivery: new Date('2024-02-20'),
        items: {
          create: [
            { productName: 'Smart Watch', quantity: 1, price: 449.99 },
            { productName: 'Watch Band', quantity: 1, price: 100.00 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        orderNumber: 'ORD-2024-003',
        status: 'processing',
        totalAmount: 129.99,
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
        items: {
          create: [
            { productName: 'Bluetooth Speaker', quantity: 1, price: 129.99 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        orderNumber: 'ORD-2024-004',
        status: 'pending',
        totalAmount: 89.99,
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
        items: {
          create: [
            { productName: 'USB-C Cable Pack', quantity: 3, price: 29.99 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        orderNumber: 'ORD-2024-005',
        status: 'cancelled',
        totalAmount: 999.99,
        shippingAddress: '789 Pine Rd, Chicago, IL 60601',
        items: {
          create: [
            { productName: 'Laptop Stand', quantity: 1, price: 149.99 },
            { productName: 'Mechanical Keyboard', quantity: 1, price: 850.00 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        orderNumber: 'ORD-2024-006',
        status: 'delivered',
        totalAmount: 79.99,
        shippingAddress: '789 Pine Rd, Chicago, IL 60601',
        trackingNumber: 'TRK456789123',
        estimatedDelivery: new Date('2024-01-10'),
        items: {
          create: [
            { productName: 'Mouse Pad XL', quantity: 1, price: 39.99 },
            { productName: 'Webcam Cover', quantity: 2, price: 20.00 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[3].id,
        orderNumber: 'ORD-2024-007',
        status: 'shipped',
        totalAmount: 199.99,
        shippingAddress: '321 Elm St, Houston, TX 77001',
        trackingNumber: 'TRK321654987',
        estimatedDelivery: new Date('2024-02-25'),
        items: {
          create: [
            { productName: 'Wireless Mouse', quantity: 1, price: 79.99 },
            { productName: 'Desk Organizer', quantity: 1, price: 120.00 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[4].id,
        orderNumber: 'ORD-2024-008',
        status: 'processing',
        totalAmount: 349.99,
        shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
        items: {
          create: [
            { productName: 'Monitor Light Bar', quantity: 1, price: 149.99 },
            { productName: 'Ergonomic Chair Cushion', quantity: 1, price: 200.00 },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${orders.length} orders`)

  // Create Payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        userId: users[0].id,
        invoiceNumber: 'INV-2024-001',
        amount: 299.99,
        status: 'paid',
        paymentMethod: 'credit_card',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[0].id,
        invoiceNumber: 'INV-2024-002',
        amount: 549.99,
        status: 'paid',
        paymentMethod: 'paypal',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[1].id,
        invoiceNumber: 'INV-2024-003',
        amount: 129.99,
        status: 'pending',
        paymentMethod: 'credit_card',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[1].id,
        invoiceNumber: 'INV-2024-004',
        amount: 89.99,
        status: 'pending',
        paymentMethod: 'bank_transfer',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[2].id,
        invoiceNumber: 'INV-2024-005',
        amount: 999.99,
        status: 'refunded',
        paymentMethod: 'credit_card',
        refundStatus: 'completed',
        refundAmount: 999.99,
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[2].id,
        invoiceNumber: 'INV-2024-006',
        amount: 79.99,
        status: 'paid',
        paymentMethod: 'paypal',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[3].id,
        invoiceNumber: 'INV-2024-007',
        amount: 199.99,
        status: 'paid',
        paymentMethod: 'credit_card',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[3].id,
        invoiceNumber: 'INV-2024-008',
        amount: 450.00,
        status: 'paid',
        paymentMethod: 'credit_card',
        refundStatus: 'requested',
        refundAmount: 150.00,
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[4].id,
        invoiceNumber: 'INV-2024-009',
        amount: 349.99,
        status: 'pending',
        paymentMethod: 'bank_transfer',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[4].id,
        invoiceNumber: 'INV-2024-010',
        amount: 599.99,
        status: 'failed',
        paymentMethod: 'credit_card',
      },
    }),
  ])

  console.log(`✅ Created ${payments.length} payments`)

  // Create FAQs
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'How do I reset my password?',
        answer: 'To reset your password, click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. The link expires in 24 hours.',
        category: 'account',
        keywords: ['password', 'reset', 'forgot', 'login', 'access'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How can I track my order?',
        answer: 'You can track your order by going to "My Orders" in your account dashboard. Click on the order you want to track and you\'ll see the tracking number and current status. You can also click the tracking link to see detailed shipping updates.',
        category: 'orders',
        keywords: ['track', 'order', 'shipping', 'delivery', 'status'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items. Products must be unused and in original packaging. To initiate a return, go to "My Orders", select the order, and click "Return Item". Some items like electronics may have different return windows.',
        category: 'returns',
        keywords: ['return', 'refund', 'policy', 'exchange', 'money back'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Same-day delivery is available in select cities. Shipping times may vary during peak seasons and holidays.',
        category: 'shipping',
        keywords: ['shipping', 'delivery', 'time', 'days', 'fast', 'express'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How do I cancel my order?',
        answer: 'You can cancel your order within 1 hour of placing it by going to "My Orders" and clicking "Cancel Order". If the order has already been processed, you\'ll need to wait for delivery and then request a return.',
        category: 'orders',
        keywords: ['cancel', 'order', 'stop', 'remove'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are securely processed.',
        category: 'payment',
        keywords: ['payment', 'credit card', 'paypal', 'pay', 'checkout'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How do I contact customer support?',
        answer: 'You can reach our customer support team through this chat, by email at support@example.com, or by phone at 1-800-123-4567. Our support hours are Monday-Friday 9 AM - 6 PM EST.',
        category: 'support',
        keywords: ['contact', 'support', 'help', 'phone', 'email', 'customer service'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How do I update my shipping address?',
        answer: 'Go to "Account Settings" and click on "Addresses". You can add, edit, or remove shipping addresses. Note that you cannot change the address for orders that have already been shipped.',
        category: 'account',
        keywords: ['address', 'shipping', 'change', 'update', 'edit'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you offer gift wrapping?',
        answer: 'Yes! We offer gift wrapping for $5.99 per item. You can add gift wrapping during checkout. We also offer personalized gift messages at no extra charge.',
        category: 'orders',
        keywords: ['gift', 'wrap', 'present', 'packaging'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How do I apply a promo code?',
        answer: 'Enter your promo code in the "Promo Code" field during checkout and click "Apply". The discount will be reflected in your order total. Only one promo code can be used per order.',
        category: 'payment',
        keywords: ['promo', 'code', 'discount', 'coupon', 'deal'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'What if my item arrives damaged?',
        answer: 'If your item arrives damaged, please contact us within 48 hours of delivery. Take photos of the damage and packaging, then go to "My Orders" and select "Report Issue". We\'ll arrange a replacement or refund.',
        category: 'returns',
        keywords: ['damaged', 'broken', 'defective', 'issue', 'problem'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How do I request a refund?',
        answer: 'To request a refund, first initiate a return from "My Orders". Once we receive and inspect the returned item, the refund will be processed within 5-7 business days to your original payment method.',
        category: 'returns',
        keywords: ['refund', 'money', 'return', 'reimburse'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Can I change my order after placing it?',
        answer: 'Order modifications are only possible within 30 minutes of placing the order and before processing begins. Go to "My Orders", select the order, and click "Modify Order" if the option is available.',
        category: 'orders',
        keywords: ['change', 'modify', 'edit', 'order', 'update'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to over 100 countries. International shipping rates and delivery times vary by destination. Import duties and taxes may apply and are the responsibility of the recipient.',
        category: 'shipping',
        keywords: ['international', 'ship', 'global', 'country', 'overseas'],
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How do I delete my account?',
        answer: 'To delete your account, go to "Account Settings" > "Privacy" > "Delete Account". Please note this action is permanent and all your data will be removed. Active orders must be completed before deletion.',
        category: 'account',
        keywords: ['delete', 'account', 'remove', 'close', 'deactivate'],
      },
    }),
  ])

  console.log(`✅ Created ${faqs.length} FAQs`)

  // Create sample conversations with messages
  const conversation1 = await prisma.conversation.create({
    data: {
      userId: users[0].id,
      title: 'Order tracking inquiry',
      status: 'resolved',
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hi, I want to track my order ORD-2024-002',
          },
          {
            role: 'assistant',
            content: 'I\'d be happy to help you track your order! Let me look that up for you. Your order ORD-2024-002 is currently shipped and on its way. The tracking number is TRK987654321 and estimated delivery is February 20, 2024.',
            agentType: 'order',
          },
          {
            role: 'user',
            content: 'Thank you! Can you tell me what\'s in that order?',
          },
          {
            role: 'assistant',
            content: 'Of course! Your order ORD-2024-002 contains: 1x Smart Watch ($449.99) and 1x Watch Band ($100.00). The total order value is $549.99.',
            agentType: 'order',
          },
        ],
      },
    },
  })

  const conversation2 = await prisma.conversation.create({
    data: {
      userId: users[2].id,
      title: 'Refund status check',
      status: 'resolved',
      messages: {
        create: [
          {
            role: 'user',
            content: 'I cancelled my order ORD-2024-005 last week. When will I get my refund?',
          },
          {
            role: 'assistant',
            content: 'Let me check the refund status for your cancelled order. Good news! The refund for order ORD-2024-005 has been completed. The full amount of $999.99 has been refunded to your original payment method. It may take 3-5 business days to appear in your account.',
            agentType: 'billing',
          },
        ],
      },
    },
  })

  console.log(`✅ Created ${2} sample conversations`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
