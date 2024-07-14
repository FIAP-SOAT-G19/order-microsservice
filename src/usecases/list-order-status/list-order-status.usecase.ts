import { ListOrderStatusGatewayInterface } from '@/adapters/gateways/list-order-status/list-order-status.gateway.interface'
import { InvalidParamError, OrderNotFoundError } from '@/shared/errors'
import { isValidString } from '@/shared/helpers/string.helper'
import { ListOrderStatusUseCaseInterface } from './list-order-status.usecase.interface'

export class ListOrderStatusUseCase implements ListOrderStatusUseCaseInterface {
  constructor(private readonly gateway: ListOrderStatusGatewayInterface) {}
  async execute(orderNumber: string): Promise<any> {
    if (!isValidString(orderNumber)) {
      throw new InvalidParamError('orderNumber')
    }

    const order = await this.gateway.getOrderByOrderNumber(orderNumber)
    if (!order) {
      throw new OrderNotFoundError()
    }

    return order.status
  }
}
