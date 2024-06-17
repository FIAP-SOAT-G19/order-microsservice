import { ListOrderByOrderNumberController } from '@/adapters/controllers/list-order-by-order-number/list-order-by-order-number.controller'
import { ListOrderByOrderNumberGateway } from '@/adapters/gateways/list-order-by-order-number/list-order-by-order-number.gateway'
import { ListOrderByOrderNumberUseCase } from '@/usecases/list-order-by-order-number/list-order-by-orderNumber.usecase'

export const listOrderByOrderNumberControllerFactory = (): ListOrderByOrderNumberController => {
  const gateway = new ListOrderByOrderNumberGateway()
  const listOrderByOrderNumberUseCase = new ListOrderByOrderNumberUseCase(gateway)
  return new ListOrderByOrderNumberController(listOrderByOrderNumberUseCase)
}
