import { success } from '@/shared/helpers/http.helper'
import { ControllerInterface, HttpResponse } from '../controller.interface'
import { ListOrdersUseCaseInterface } from '@/usecases/list-orders/list-orders.usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'

export class ListOrdersController implements ControllerInterface {
  constructor(private readonly listOrderUseCase: ListOrdersUseCaseInterface) {}
  async execute (): Promise<HttpResponse> {
    try {
      const output = await this.listOrderUseCase.execute()
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
