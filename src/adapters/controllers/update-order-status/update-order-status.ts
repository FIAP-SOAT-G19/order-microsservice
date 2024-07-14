import { success } from '@/shared/helpers/http.helper'
import { ControllerInterface, HttpRequest, HttpResponse } from '../controller.interface'
import { UpdateOrderUseCaseInterface } from '@/usecases/update-order-status/update-order.usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'

export class UpdateOrderStatusController implements ControllerInterface {
  constructor(private readonly updateOrderStatusUseCase: UpdateOrderUseCaseInterface) {}
  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.updateOrderStatusUseCase.execute(input?.params?.orderNumber, input?.body?.status)
      return success(204, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
