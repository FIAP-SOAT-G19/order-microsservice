import { OrderRepositoryInput, OrderRepositoryInterface, OrderRepositoryOutput } from './order.repository.interface'
import { PrismaClient } from '@prisma/client'

export class OrderRepository implements OrderRepositoryInterface {
  constructor(private readonly prismaClient: PrismaClient) {}
  async create (input: OrderRepositoryInput): Promise<OrderRepositoryOutput> {
    const order = await this.prismaClient.order.create({
      data: {
        id: input.id,
        orderNumber: input.orderNumber,
        clientId: input.clientId,
        clientDocument: input.clientDocument,
        status: input.status,
        totalValue: input.totalValue,
        createdAt: input.createdAt
      }
    })

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
}
