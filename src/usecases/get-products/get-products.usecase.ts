import { ProductNotFoundError } from '@/shared/errors'
import { IGetProductsUseCase } from './get-products.usecase.interface'
import { GetProductsGatewayInterface } from '@/adapters/gateways/get-products/get-products.gateway.interface'

export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    private readonly gateway: GetProductsGatewayInterface
  ) {}

  async execute(): Promise<IGetProductsUseCase.Output[]> {
    const products = await this.gateway.getAll()
    if (!products) {
      throw new ProductNotFoundError()
    }
    return products
  }
}
