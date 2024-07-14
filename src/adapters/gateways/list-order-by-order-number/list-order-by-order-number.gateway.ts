import { ListOrderByOrderNumberOutput } from '@/usecases/list-order-by-order-number/list-order-by-orderNumber.usecase.interface'
import { ListOrderByOrderNumberGatewayInterface } from './list-order-by-order-number.gateway.interface'
import { prismaClient } from '../prisma.client'

export class ListOrderByOrderNumberGateway implements ListOrderByOrderNumberGatewayInterface {
  async listOrderByOrderNumber (orderNumber: string): Promise<ListOrderByOrderNumberOutput | null> {
    const order = await prismaClient.order.findFirst({
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalValue: true,
        paidAt: true,
        clientId: true,
        clientDocument: true,
        OrderProduct: {
          select: {
            amount: true,
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        },
        client: {
          select: {
            name: true
          }
        }
      },
      where: { orderNumber }
    })

    if (!order) {
      return null
    }

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paidAt: order.paidAt,
        totalValue: order.totalValue,
        clientDocument: order.clientDocument ?? undefined,
        clientId: order.clientId ?? undefined
      },
      products: order.OrderProduct.map((product: any) => ({
        name: product.product.name,
        amount: product.amount,
        price: product.product.price
      })),
      client: {
        name: order.client?.name ?? ''
      }
    }
  }
}
