import { ClientEntity } from '@/entities/clients/client.entity'
import { ProductEntity } from '@/entities/products/product.entity'
import { prismaClient } from '../prisma.client'
import { CreateOrderInput, CreateOrderGatewayInterface, CreateOrderOutput, CreateOrderProductInput } from './order.gateway.interface'

export class CreateOrderGateway implements CreateOrderGatewayInterface {
  async createOrder (data: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = await prismaClient.order.create({ data })

    return {
      id: order.id,
      status: order.status,
      orderNumber: order.orderNumber,
      totalValue: order.totalValue,
      clientId: order.clientId ?? '',
      clientDocument: order.clientDocument,
      createdAt: order.createdAt,
      paidAt: order.paidAt
    }
  }

  async createOrderProduct (data: CreateOrderProductInput): Promise<void> {
    await prismaClient.orderProduct.create({ data })
  }

  async getProductById (id: string): Promise<ProductEntity | null> {
    const product = await prismaClient.product.findFirst({ where: { id } })
    if (!product) {
      return null
    }

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt ?? undefined
    }
  }

  async getClientById (id: string): Promise<ClientEntity | null> {
    const client = await prismaClient.client.findFirst({ where: { id } })
    if (!client) {
      return null
    }

    return {
      id: client.id,
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      identifier: client.identifier,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt ?? undefined
    }
  }
}
