import { UpdateOrderStatusGatewayInterface } from '@/adapters/gateways/update-order-status/update-order-status.gateway.interface'
import { UpdateOrderUseCaseInterface } from './update-order.usecase.interface'
import { isValidString } from '@/shared/helpers/string.helper'
import { InvalidParamError, OrderNotFoundError } from '@/shared/errors'
import constants from '@/shared/constants'

export class UpdateOrderUseCase implements UpdateOrderUseCaseInterface {
  constructor(private readonly gateway: UpdateOrderStatusGatewayInterface) {}
  async execute(orderNumber: string, status: string): Promise<void> {
    await this.validateOrderNumber(orderNumber)

    this.validateStatus(status)

    const paidAt = status === constants.ORDER_STATUS.RECEIVED ? new Date() : null

    await this.gateway.updateOrderStatus(orderNumber, status, paidAt)
  }

  private async validateOrderNumber(orderNumber: string): Promise<void> {
    if (!isValidString(orderNumber)) {
      throw new InvalidParamError('orderNumber')
    }

    const orderExists = await this.gateway.getOrderByOrderNumber(orderNumber)
    if (!orderExists) {
      throw new OrderNotFoundError()
    }
  }

  private validateStatus(status: string): void {
    if (!isValidString(status)) {
      throw new InvalidParamError('status')
    }

    const allowedStatus = ['waitingPayment', 'received', 'InPreparation', 'prepared', 'finalized', 'canceled']

    if (!allowedStatus.includes(status)) {
      throw new InvalidParamError('status')
    }
  }
}
