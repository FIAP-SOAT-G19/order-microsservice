import { OrderEntity } from '@/entities/orders/order.entity'

export interface UpdateOrderStatusGatewayInterface {
  getOrderByOrderNumber: (orderNumber: string) => Promise<OrderEntity | null>
  updateOrderStatus: (orderNumber: string, status: string, paidAt: Date | null) => Promise<void>
}
