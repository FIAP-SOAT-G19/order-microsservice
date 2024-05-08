import { CreateOrderInput, CreateOrderUseCaseInterface, CreditCardInput, ProductInput } from './create-order.usecase.interface'
import { OrderEntity } from '@/entities/orders/order.entity'
import { CreateOrderGatewayInterface } from '@/adapters/gateways/create-order/create-order.gateway.interface'
import { InvalidParamError } from '@/shared/errors'
import { Cryptodapter } from '@/adapters/tools/crypto/crypto.adapter'
import constants from '@/shared/constants'
import { logger } from '@/shared/helpers/logger.helper'

export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(
    private readonly gateway: CreateOrderGatewayInterface,
    private readonly crypto: Cryptodapter
  ) {}

  async execute (input: CreateOrderInput): Promise<string> {
    const cardIdentifier = await this.handleCreditCard(input?.payment?.creditCard)

    const order = await this.handleOrder(input, input.products)

    await this.handleProducts(input?.products, order)

    await this.sendMessageQueue(order.orderNumber, order.totalValue, cardIdentifier)

    return order.orderNumber
  }

  private async handleOrder(input: CreateOrderInput, products: ProductInput []): Promise<OrderEntity> {
    await this.validateClient(input?.clientId)

    const order = OrderEntity.build({
      status: constants.ORDER_STATUS.WAITING_PAYMENT,
      totalValue: this.calculateTotalValue(products),
      clientId: input?.clientId,
      clientDocument: input?.clientDocument
    })

    await this.gateway.createOrder(order)

    return order
  }

  private async handleProducts(products: ProductInput [], order: OrderEntity): Promise<void> {
    for (const product of products) {
      const productExists = await this.gateway.getProductById(product.id)
      if (!productExists) {
        throw new InvalidParamError('productId')
      }
    }

    for (const product of products) {
      await this.gateway.createOrderProduct({
        id: this.crypto.generateUUID(),
        orderId: order.id,
        productId: product.id,
        productPrice: product.price,
        amount: product.amount,
        createdAt: order.createdAt
      })
    }
  }

  private async handleCreditCard(creditCard: CreditCardInput): Promise<string> {
    const requiredFields: Array<keyof CreditCardInput> = ['number', 'brand', 'cvv', 'expiryMonth', 'expiryYear']

    for (const field of requiredFields) {
      if (!creditCard[field]) {
        throw new InvalidParamError(`payment.creditCard.${field}`)
      }
    }

    const encryptedCard = this.crypto.encrypt(creditCard)

    try {
      logger.info(`Send request to card_encryptor microsservice.\nEncryptedCard: ${encryptedCard}`)
      const cardIdentifier = await this.gateway.saveCardExternal(encryptedCard)

      if (!this.isValidUUID(cardIdentifier)) {
        logger.error('Error whilling get cardId')
        throw new InvalidParamError('cardId')
      }

      return cardIdentifier
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  private async validateClient(clientId?: string): Promise<void> {
    if (!clientId) {
      return
    }

    const clientExists = await this.gateway.getClientById(clientId)
    if (!clientExists) {
      throw new InvalidParamError('clientId')
    }
  }

  private calculateTotalValue (products: ProductInput []): number {
    if (!products?.length) {
      throw new InvalidParamError('products')
    }

    return products.reduce((accumulator, element) => accumulator + (element.price * element.amount), 0)
  }

  private async sendMessageQueue(orderNumber: string, totalValue: number, cardIdentifier: string): Promise<void> {
    const messageBody = JSON.stringify({ orderNumber, totalValue, cardIdentifier })
    const queueName = constants.QUEUE_CREATED_PAYMENT

    logger.info(`Publishing message on queue\nQueueName: ${queueName}\nMessage: ${messageBody}`)
    const success = await this.gateway.sendMessageQueue(queueName, messageBody, constants.MESSAGE_GROUP_ID, orderNumber)

    if (success) {
      await this.gateway.createPublishedMessageLog({
        id: this.crypto.generateUUID(),
        message: messageBody,
        queue: queueName,
        origin: 'CreateOrderUseCase',
        createdAt: new Date()
      })
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
