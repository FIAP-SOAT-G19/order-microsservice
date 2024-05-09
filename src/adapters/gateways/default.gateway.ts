import { OrderEntity } from '@/entities/orders/order.entity'
import { prismaClient } from './prisma.client'

export class DefaultGateway {
  async getOrderByOrderNumber(orderNumber: string): Promise<OrderEntity | null> {
    const order = await prismaClient.order.findFirst({ where: { orderNumber } })

    if (!order) {
      return null
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalValue: order.totalValue,
      clientDocument: order.clientDocument ?? undefined,
      clientId: order.clientId ?? undefined,
      createdAt: order.createdAt,
      paidAt: order.paidAt ?? undefined
    }
  }
}
