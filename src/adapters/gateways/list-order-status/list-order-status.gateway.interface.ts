import { OrderEntity } from '@/entities/orders/order.entity'

export interface ListOrderStatusGatewayInterface {
  getOrderByOrderNumber: (orderNumber: string) => Promise<OrderEntity | null>
}
