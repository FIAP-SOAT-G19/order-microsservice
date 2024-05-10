import { CreateOrderUseCaseInterface } from '@/usecases/create-orders/create-order.usecase.interface'
import { ControllerInterface, HttpRequest, HttpResponse } from '../controller.interface'
import { success } from '@/shared/helpers/http.helper'
import { handleError } from '@/shared/helpers/error.helper'

export class CreateOrderController implements ControllerInterface {
  constructor(private readonly createOrderUseCase: CreateOrderUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const orderNumber = await this.createOrderUseCase.execute(input.body)
      return success(201, { orderNumber })
    } catch (error: any) {
      return handleError(error)
    }
  }
}
