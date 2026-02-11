import { z } from 'zod';
import {
  ClassificationResultSchema,
  StreamEventSchema,
  AgentTypeSchema
} from './schemas';
import { MESSAGE_ROLES, CONVERSATION_STATUSES, ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS, REFUND_STATUSES } from './constants';

// Derived types from schemas
export type AgentType = z.infer<typeof AgentTypeSchema>;
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;
export type StreamEvent = z.infer<typeof StreamEventSchema>;

// Message types
export interface Message {
  id: string
  conversationId: string
  role: typeof MESSAGE_ROLES[number]
  content: string
  agentType?: AgentType
  metadata?: Record<string, unknown>
  createdAt: Date
}

// Conversation types
export interface Conversation {
  id: string
  userId: string
  title: string | null
  status: ConversationStatus
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

export type ConversationStatus = typeof CONVERSATION_STATUSES[number];

// Agent types
export interface Agent {
  type: AgentType | 'router'
  name: string
  description: string
  capabilities: string[]
}

// Order types
export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  totalAmount: string
  shippingAddress: string
  trackingNumber: string | null
  estimatedDelivery: Date | null
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export type OrderStatus = typeof ORDER_STATUSES[number];

export interface OrderItem {
  id: string
  orderId: string
  productName: string
  quantity: number
  price: string
}

// Payment types
export interface Payment {
  id: string
  userId: string
  invoiceNumber: string
  amount: string
  status: PaymentStatus
  paymentMethod: PaymentMethod
  refundStatus: RefundStatus | null
  refundAmount: string | null
  createdAt: Date
  updatedAt: Date
}

export type PaymentStatus = typeof PAYMENT_STATUSES[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];
export type RefundStatus = typeof REFUND_STATUSES[number];

// User types
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

export interface ApiError {
  message: string
  code?: string
}
