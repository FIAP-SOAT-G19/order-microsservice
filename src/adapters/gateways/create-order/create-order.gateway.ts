import { ClientEntity } from '@/entities/clients/client.entity'
import { ProductEntity } from '@/entities/products/product.entity'
import { prismaClient } from '../prisma.client'
import { CreateOrderGatewayInput, CreateOrderGatewayInterface, CreateOrderOutput, CreateOrderProductInput, CreatePublishedMessageLog } from './create-order.gateway.interface'
import { AwsSqsAdapter } from '@/adapters/queue/aws-sqs.adapter'
import { NodeFetchAdapter } from '@/adapters/tools/http/node-fetch.adapter'
import constants from '@/shared/constants'
import { DefaultGateway } from '../default.gateway'

export class CreateOrderGateway extends DefaultGateway implements CreateOrderGatewayInterface {
  async createOrder (order: CreateOrderGatewayInput, products: CreateOrderProductInput []): Promise<CreateOrderOutput> {
    await prismaClient.order.create({
      data: {
        ...order,
        OrderProduct: {
          createMany: {
            data: products.map((product) => ({
              id: product.id,
              productId: product.productId,
              productPrice: product.productPrice,
              amount: product.amount,
              createdAt: product.createdAt
            }))
          }
        }
      }
    })

    return {
      id: order.id,
      status: order.status,
      orderNumber: order.orderNumber,
      totalValue: order.totalValue,
      clientId: order.clientId ?? '',
      clientDocument: order.clientDocument ?? '',
      createdAt: order.createdAt,
      paidAt: null
    }
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

  async sendMessageQueue (queueName: string, body: string, messageGroupId: string, messageDeduplicationId: string): Promise<boolean> {
    const queue = new AwsSqsAdapter()
    return await queue.sendMessage(queueName, body, messageGroupId, messageDeduplicationId)
  }

  async createPublishedMessageLog (data: CreatePublishedMessageLog): Promise<string> {
    const messageLog = await prismaClient.publishedMessages.create({ data })
    return messageLog.id
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

  async deleteCardExternal (cardIdentifier: string): Promise<void> {
    const http = new NodeFetchAdapter()

    const url = `${constants.CARD_ENCRYPTOR_MICROSSERVICE.URL}/card/${cardIdentifier}`
    const headers = {
      'Content-Type': 'application/json',
      appid: process.env.APP_ID,
      secretkey: process.env.SECRET_KEY
    }

    await http.delete(url, headers)
  }
}
