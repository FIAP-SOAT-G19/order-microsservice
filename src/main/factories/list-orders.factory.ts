import { ListOrdersController } from '@/adapters/controllers/list-orders/list-orders.controller'
import { ListOrdersGateway } from '@/adapters/gateways/list-orders/list-orders.gateway'
import { ListOrdersUseCase } from '@/usecases/list-orders/list-orders.usecase'

export const listOrderControllerFactory = (): ListOrdersController => {
  const gateway = new ListOrdersGateway()
  const listOrderUseCase = new ListOrdersUseCase(gateway)
  return new ListOrdersController(listOrderUseCase)
}
