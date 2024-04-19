import { OrderEntity } from '@/entities/orders/order.entity'

export type OrderRepositoryData = {
  id: string
  status: string
  totalValue: number
  createdAt: Date
  orderNumber: string
  updatedAt?: Date
  paidAt?: Date
  clientId?: string
  clientDocument?: string
}

export interface OrderRepositoryInterface {
  create: (input: OrderRepositoryData) => Promise<OrderEntity>
}
