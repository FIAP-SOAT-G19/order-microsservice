import { GetProductsController } from '@/adapters/controllers/get-products/get-products.controller'
import { GetProductsGateway } from '@/adapters/gateways/get-products/get-products.gateway'
import { GetProductsUseCase } from '@/usecases/get-products/get-products.usecase'

export const getProductsControllerFactory = (): GetProductsController => {
  const gateway = new GetProductsGateway()
  const usecase = new GetProductsUseCase(gateway)
  return new GetProductsController(usecase)
}
