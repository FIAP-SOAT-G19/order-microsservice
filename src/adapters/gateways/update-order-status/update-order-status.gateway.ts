import { UpdateOrderStatusGatewayInterface } from './update-order-status.gateway.interface'
import { prismaClient } from '../prisma.client'
import { DefaultGateway } from '../default.gateway'

export class UpdateOrderStatusGateway extends DefaultGateway implements UpdateOrderStatusGatewayInterface {
  async updateOrderStatus (orderNumber: string, status: string, paidAt: Date | null): Promise<void> {
    await prismaClient.order.update({
      data: {
        status,
        paidAt
      },
      where: {
        orderNumber
      }
    })
  }
}
