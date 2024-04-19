import { ProductEntity } from '@/entities/products/product.entity'
import { CreateOrderInput, CreateOrderUseCaseInterface } from './create-order.usecase.interface'
import { OrderEntity } from '@/entities/orders/order.entity'
import { OrderRepositoryInterface } from '@/repositories/orders/order.repository.interface'

export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}
  async execute (input: CreateOrderInput): Promise<string> {
    const products = input.products.map(product => { return ProductEntity.build(product) })

    const { id, status, orderNumber, totalValue, clientId, clientDocument, createdAt } = OrderEntity.build({
      status: input.status,
      totalValue: this.calculateTotalValue(products),
      clientId: input?.clientId,
      clientDocument: input?.clientDocument
    })

    await this.orderRepository.create({ id, status, orderNumber, totalValue, clientId, clientDocument, createdAt })

    return orderNumber
  }

  private calculateTotalValue (products: ProductEntity []): number {
    return products.reduce((accumulator, element) => accumulator + (element.price * element.amount), 0)
  }
}
