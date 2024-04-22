import { ProductEntity } from '@/entities/products/product.entity'
import { CreateOrderInput, CreateOrderUseCaseInterface } from './create-order.usecase.interface'
import { OrderEntity } from '@/entities/orders/order.entity'
import { OrderGatewayInterface } from '@/adapters/gateways/orders/order.gateway.interface'
import { UUIDAdapter } from '@/adapters/tools/uuid.adapter'

export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(
    private readonly gateway: OrderGatewayInterface,
    private readonly uuid: UUIDAdapter
  ) {}

  async execute (input: CreateOrderInput): Promise<string> {
    const products = input.products.map(product => { return ProductEntity.build(product) })

    const order = OrderEntity.build({
      status: input.status,
      totalValue: this.calculateTotalValue(products),
      clientId: input?.clientId,
      clientDocument: input?.clientDocument
    })

    await this.saveOrderAndProducts(order, products)
    return order.orderNumber
  }

  private calculateTotalValue (products: ProductEntity []): number {
    return products.reduce((accumulator, element) => accumulator + (element.price * element.amount), 0)
  }

  private async saveOrderAndProducts(order: OrderEntity, products: ProductEntity[]): Promise<void> {
    await this.gateway.createOrder({
      id: order.id,
      status: order.status,
      orderNumber: order.orderNumber,
      totalValue: order.totalValue,
      clientId: order.clientId,
      clientDocument: order.clientDocument,
      createdAt: order.createdAt
    })

    for (const product of products) {
      await this.gateway.createOrderProduct({
        id: this.uuid.generate(),
        orderId: order.id,
        productId: product.id,
        productPrice: product.price,
        amount: product.amount,
        createdAt: product.createdAt
      })
    }
  }
}
