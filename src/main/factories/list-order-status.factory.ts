import { ListOrderStatusController } from '@/adapters/controllers/list-order-status/list-order-status.controller'
import { ListOrderStatusGateway } from '@/adapters/gateways/list-order-status/list-order-status.gateway'
import { ListOrderStatusUseCase } from '@/usecases/list-order-status/list-order-status.usecase'

export const listOrderStatusControllerFactory = (): ListOrderStatusController => {
  const gateway = new ListOrderStatusGateway()
  const listOrderStatusUseCase = new ListOrderStatusUseCase(gateway)
  return new ListOrderStatusController(listOrderStatusUseCase)
}
