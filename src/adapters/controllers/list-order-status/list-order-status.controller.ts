import { success } from '../../../shared/helpers/http.helper'
import { ControllerInterface, HttpRequest, HttpResponse } from '../controller.interface'
import { ListOrderStatusUseCaseInterface } from '../../../usecases/list-order-status/list-order-status.usecase.interface'
import { handleError } from '../../../shared/helpers/error.helper'

export class ListOrderStatusController implements ControllerInterface {
  constructor(private readonly listOrderStatusUseCase: ListOrderStatusUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.listOrderStatusUseCase.execute(input?.params?.orderNumber)
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
