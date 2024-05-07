import { ClientEntity } from '@/entities/clients/client.entity'
import { ProductEntity } from '@/entities/products/product.entity'
import { prismaClient } from '../prisma.client'
import { CreateOrderInput, CreateOrderGatewayInterface, CreateOrderOutput, CreateOrderProductInput, CreatePublishedMessageLog } from './order.gateway.interface'
import { AwsSqsAdapter } from '@/adapters/queue/aws-sqs.adapter'
import { NodeFetchAdapter } from '@/adapters/tools/http/node-fetch.adapter'
import constants from '@/shared/constants'

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

  async sendMessageQueue (queueName: string, body: string): Promise<boolean> {
    const queue = new AwsSqsAdapter()
    return await queue.sendMessage(queueName, body)
  }

  async createPublishedMessageLog (data: CreatePublishedMessageLog): Promise<void> {
    await prismaClient.publishedMessages.create({ data })
  }

  async saveCardExternal (encryptedCard: string): Promise<string> {
    const http = new NodeFetchAdapter()

    const url = `${constants.CARD_ENCRYPTOR_MICROSSERVICE.URL}/card`
    const data = { encryptedCard }
    const headers = {
      'Content-Type': 'application/json',
      appid: process.env.APP_ID,
      secretkey: process.env.SECRET_KEY
    }

    const response = await http.post(url, headers, data)
    return response
  }
}
