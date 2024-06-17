import { ListOrdersGatewayInterface } from '@/adapters/gateways/list-orders/list-orders.gateway.interface'
import { ListOrderOutput, ListOrdersUseCaseInterface } from './list-orders.usecase.interface'

export class ListOrdersUseCase implements ListOrdersUseCaseInterface {
  constructor(private readonly gateway: ListOrdersGatewayInterface) {}
  async execute (): Promise<ListOrderOutput [] | null> {
    const orders = await this.gateway.listOrders()
    return orders
  }
}
