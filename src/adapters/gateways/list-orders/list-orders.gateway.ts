import { ListOrderOutput } from '@/usecases/list-orders/list-orders.usecase.interface'
import { ListOrdersGatewayInterface } from './list-orders.gateway.interface'
import { prismaClient } from '../prisma.client'

export class ListOrdersGateway implements ListOrdersGatewayInterface {
  async listOrders (): Promise<ListOrderOutput[] | null> {
    const orders = await prismaClient.order.findMany({
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
      }
    })

    if (!orders) {
      return null
    }

    const output: ListOrderOutput[] = []

    for (let i = 0; i < orders.length; i++) {
      output.push({
        order: {
          id: orders[i].id,
          orderNumber: orders[i].orderNumber,
          status: orders[i].status,
          paidAt: orders[i].paidAt,
          totalValue: orders[i].totalValue,
          clientDocument: orders[i].clientDocument ?? undefined,
          clientId: orders[i].clientId ?? undefined
        },
        products: orders[i].OrderProduct.map((product: any) => ({
          name: product.product.name,
          amount: product.amount,
          price: product.product.price
        })),
        client: {
          name: orders[i].client?.name ?? ''
        }
      })
    }

    return output
  }
}
