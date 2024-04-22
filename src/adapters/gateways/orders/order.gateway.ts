import { prismaClient } from '../prisma.client'
import { CreateOrderInput, OrderGatewayInterface, CreateOrderOutput, CreateOrderProductInput } from './order.gateway.interface'

export class OrderRepository implements OrderGatewayInterface {
  async createOrder (data: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = await prismaClient.order.create({ data })

    return {
      id: order.id,
      status: order.status,
      orderNumber: order.orderNumber,
      totalValue: order.totalValue,
      clientId: order.clientId ?? undefined,
      clientDocument: order.clientDocument ?? undefined,
      createdAt: order.createdAt
    }
  }

  async createOrderProduct (data: CreateOrderProductInput): Promise<void> {
    await prismaClient.orderProduct.create({ data })
  }
}
