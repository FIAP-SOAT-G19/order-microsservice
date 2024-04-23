import { CreateOrderInput, CreateOrderUseCaseInterface, ProductInput } from './create-order.usecase.interface'
import { OrderEntity } from '@/entities/orders/order.entity'
import { CreateOrderGatewayInterface } from '@/adapters/gateways/orders/order.gateway.interface'
import { InvalidParamError } from '@/shared/errors'
import { UUIDAdapter } from '@/adapters/tools/crypto/uuid.adapter'
import constants from '@/shared/constants'

export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(
    private readonly gateway: CreateOrderGatewayInterface,
    private readonly uuid: UUIDAdapter
  ) {}

  async execute (input: CreateOrderInput): Promise<string> {
    await this.validate(input?.products, input?.clientId)

    const products = input.products

    const order = OrderEntity.build({
      status: constants.ORDER_STATUS.WAITING_PAYMENT,
      totalValue: this.calculateTotalValue(products),
      clientId: input?.clientId,
      clientDocument: input?.clientDocument
    })

    await this.saveOrderAndProducts(order, products)
    return order.orderNumber
  }

  private async validate(products: ProductInput [], clientId?: string): Promise<void> {
    await this.validateProducts(products)
    await this.validateClient(clientId)
  }

  private async validateProducts(products: ProductInput []): Promise<void> {
    if (!products?.length) {
      throw new InvalidParamError('productId')
    }

    for (const product of products) {
      const productExists = await this.gateway.getProductById(product.id)
      if (!productExists) {
        throw new InvalidParamError('productId')
      }
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
    return products.reduce((accumulator, element) => accumulator + (element.price * element.amount), 0)
  }

  private async saveOrderAndProducts(order: OrderEntity, products: ProductInput[]): Promise<void> {
    await this.gateway.createOrder(order)

    for (const product of products) {
      await this.gateway.createOrderProduct({
        id: this.uuid.generate(),
        orderId: order.id,
        productId: product.id,
        productPrice: product.price,
        amount: order.totalValue,
        createdAt: order.createdAt
      })
    }
  }
}
