import { success } from '@/shared/helpers/http.helper'
import { ControllerInterface, HttpRequest, HttpResponse } from '../controller.interface'
import { ListOrderByOrderNumberUseCaseInterface } from '@/usecases/list-order-by-order-number/list-order-by-orderNumber.usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'

export class ListOrderByOrderNumberController implements ControllerInterface {
  constructor(private readonly listOrderByOrderNumberUseCase: ListOrderByOrderNumberUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.listOrderByOrderNumberUseCase.execute(input?.params?.orderNumber)
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
