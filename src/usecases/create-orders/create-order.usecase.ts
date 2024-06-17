import { CreateOrderInput, CreateOrderUseCaseInterface, CreditCardInput, ProductInput, ProductMessageInput } from './create-order.usecase.interface'
import { OrderEntity } from '@/entities/orders/order.entity'
import { CreateOrderGatewayInterface, CreateOrderProductInput } from '@/adapters/gateways/create-order/create-order.gateway.interface'
import { InvalidParamError, ServerError } from '@/shared/errors'
import { Cryptodapter } from '@/adapters/tools/crypto/crypto.adapter'
import constants from '@/shared/constants'
import { logger } from '@/shared/helpers/logger.helper'
import { ClientEntity } from '@/entities/clients/client.entity'

export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(
    private readonly gateway: CreateOrderGatewayInterface,
    private readonly crypto: Cryptodapter
  ) {}

  async execute (input: CreateOrderInput): Promise<string> {
    const cardIdentifier = await this.handleCreditCard(input?.payment?.creditCard)

    const client = await this.handleClient(input?.clientId)

    const order = OrderEntity.build({
      status: constants.ORDER_STATUS.WAITING_PAYMENT,
      totalValue: this.calculateTotalValue(input.products),
      clientId: input?.clientId,
      clientDocument: input?.clientDocument
    })

    const orderProducts = await this.handleProducts(input?.products)

    return this.createOrderAndSendMessageQueue(order, orderProducts, client, cardIdentifier)
  }

  private async handleCreditCard(creditCard: CreditCardInput): Promise<string> {
    const requiredFields: Array<keyof CreditCardInput> = ['number', 'brand', 'cvv', 'expiryMonth', 'expiryYear']

    for (const field of requiredFields) {
      if (!creditCard[field]) {
        throw new InvalidParamError(`payment.creditCard.${field}`)
      }
    }

    try {
      const encryptedCard = this.crypto.encrypt(creditCard)
      const cardIdentifier = await this.gateway.saveCardExternal(encryptedCard)

      logger.info('Send request to card_encryptor microsservice.')

      if (!this.isValidUUID(cardIdentifier)) {
        logger.error('Error whilling get cardIdentifier')
        throw new InvalidParamError('cardIdentifier')
      }

      return cardIdentifier
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  private async handleClient(clientId?: string): Promise<ClientEntity | null> {
    if (!clientId) {
      return null
    }

    const client = await this.gateway.getClientById(clientId)
    if (!client) {
      throw new InvalidParamError('clientId')
    }

    return client
  }

  private async handleProducts(products: ProductInput []): Promise<ProductMessageInput []> {
    const productsOutput: ProductMessageInput [] = []
    for (const product of products) {
      const productExists = await this.gateway.getProductById(product.id)

      if (!productExists) {
        throw new InvalidParamError('productId')
      }

      productsOutput.push({
        id: productExists.id,
        name: productExists.name,
        category: productExists.category,
        price: productExists.price,
        description: productExists.description,
        image: productExists.image,
        amount: product.amount,
        createdAt: productExists.createdAt,
        updatedAt: productExists.updatedAt
      })
    }

    return productsOutput
  }

  private calculateTotalValue (products: ProductInput []): number {
    if (!products?.length) {
      throw new InvalidParamError('products')
    }

    return products.reduce((accumulator, element) => accumulator + (element.price * element.amount), 0)
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  private async createOrderAndSendMessageQueue(order: OrderEntity, orderProducts: ProductMessageInput [], client: ClientEntity | null, cardIdentifier: string): Promise<string> {
    const { id, orderNumber, totalValue } = order
    try {
      const products: CreateOrderProductInput [] = []

      for (const product of orderProducts) {
        products.push({
          id: this.crypto.generateUUID(),
          orderId: id,
          productId: product.id,
          productPrice: product.price,
          amount: product.amount,
          createdAt: order.createdAt
        })
      }

      await this.gateway.createOrder(order, products)
      await this.sendMessageQueue(orderNumber, totalValue, cardIdentifier, orderProducts, client)

      logger.info(`Created order. OrderNumber: ${orderNumber}`)
      return orderNumber
    } catch (error: any) {
      logger.error(error)

      await this.handleError(orderNumber, cardIdentifier)

      throw new ServerError(error)
    }
  }

  private async sendMessageQueue(orderNumber: string, totalValue: number, cardIdentifier: string, products: ProductMessageInput [], client: ClientEntity | null): Promise<void> {
    const messageBody = JSON.stringify({ orderNumber, totalValue, cardIdentifier, products, client })
    const queueName = process.env.CREATED_ORDER_QUEUE_NAME!

    const success = await this.gateway.sendMessageQueue(queueName, messageBody, constants.MESSAGE_GROUP_ID, orderNumber)

    if (!success) {
      logger.error(`Error publishing message: ${JSON.stringify(messageBody)}`)
      throw new ServerError(new Error('Error publishing message'))
    }

    const messageLogId = await this.gateway.createPublishedMessageLog({
      id: this.crypto.generateUUID(),
      message: messageBody,
      queue: queueName,
      origin: 'CreateOrderUseCase',
      createdAt: new Date()
    })

    logger.info(`Published message on queue. MessageId: ${messageLogId}`)
  }

  private async handleError(orderNumber: string, cardIdentifier: string): Promise<void> {
    try {
      await this.gateway.updateOrderStatus(orderNumber, constants.ORDER_STATUS.CANCELED, null)
      logger.info(`Canceled order. OrderNumber: ${orderNumber}`)

      await this.gateway.deleteCardExternal(cardIdentifier)
      logger.info(`Deleted card. CardIdentifier: ${cardIdentifier}`)
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
