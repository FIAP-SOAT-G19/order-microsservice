import { isValidString } from '@/shared/helpers/string.helper'
import { ListOrderByOrderNumberOutput, ListOrderByOrderNumberUseCaseInterface } from './list-order-by-orderNumber.usecase.interface'
import { InvalidParamError } from '@/shared/errors'
import { ListOrderByOrderNumberGatewayInterface } from '@/adapters/gateways/list-order-by-order-number/list-order-by-order-number.gateway.interface'

export class ListOrderByOrderNumberUseCase implements ListOrderByOrderNumberUseCaseInterface {
  constructor(private readonly gateway: ListOrderByOrderNumberGatewayInterface) {}
  async execute (orderNumber: string): Promise<ListOrderByOrderNumberOutput | null> {
    if (!isValidString(orderNumber)) {
      throw new InvalidParamError('orderNumber')
    }

    const order = await this.gateway.listOrderByOrderNumber(orderNumber)
    return order
  }
}
