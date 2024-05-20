import { ControllerInterface, HttpResponse } from '../controller.interface'
import { success } from '@/shared/helpers/http.helper'
import { handleError } from '@/shared/helpers/error.helper'
import { IGetProductsUseCase } from '@/usecases/get-products/get-products.usecase.interface'

export class GetProductsController implements ControllerInterface {
  constructor(private readonly getProductsUseCase: IGetProductsUseCase) {}
  async execute (): Promise<HttpResponse> {
    try {
      const products = await this.getProductsUseCase.execute()
      return success(200, products)
    } catch (error: any) {
      return handleError(error)
    }
  }
}
