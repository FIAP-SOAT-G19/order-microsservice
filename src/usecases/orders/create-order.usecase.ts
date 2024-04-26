import { CreateOrderInput, CreateOrderUseCaseInterface, CreditCardInput, ProductInput } from './create-order.usecase.interface'
import { OrderEntity } from '@/entities/orders/order.entity'
import { CreateOrderGatewayInterface } from '@/adapters/gateways/orders/order.gateway.interface'
import { InvalidParamError } from '@/shared/errors'
import { Cryptodapter } from '@/adapters/tools/crypto/crypto.adapter'
import constants from '@/shared/constants'

export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(
    private readonly gateway: CreateOrderGatewayInterface,
    private readonly crypto: Cryptodapter
  ) {}

  async execute (input: CreateOrderInput): Promise<string> {
    const order = await this.handleOrder(input, input.products)

    const cardIdentifier = await this.handleCreditCard(input?.payment?.creditCard)

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
    await this.handleProducts(input.products, order)

    return order
  }

  private async handleProducts(products: ProductInput [], order: OrderEntity): Promise<ProductInput []> {
    let successCount = 0

    for (const product of products) {
      const productExists = await this.gateway.getProductById(product.id)
      if (!productExists) {
        throw new InvalidParamError('productId')
      }
      successCount++
    }

    if (successCount === products.length) {
      for (const product of products) {
        await this.gateway.createOrderProduct({
          id: this.crypto.generateUUID(),
          orderId: order.id,
          productId: product.id,
          productPrice: product.price,
          amount: order.totalValue,
          createdAt: order.createdAt
        })
      }
    }

    return products
  }

  private async handleCreditCard(creditCard: CreditCardInput): Promise<string> {
    const requiredFields: Array<keyof CreditCardInput> = ['number', 'brand', 'cvv', 'expiryMonth', 'expiryYear']

    for (const field of requiredFields) {
      if (!creditCard[field]) {
        throw new InvalidParamError(`payment.creditCard.${field}`)
      }
    }

    const encryptedCard = this.crypto.encrypt(creditCard)
    const cardIdentifier = await this.gateway.saveCardExternal(encryptedCard)
    return cardIdentifier
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

    const success = await this.gateway.sendMessageQueue(queueName, messageBody)

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
}
