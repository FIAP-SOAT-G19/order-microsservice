import { UpdateOrderStatusController } from '@/adapters/controllers/update-order-status/update-order-status'
import { UpdateOrderStatusGateway } from '@/adapters/gateways/update-order-status/update-order-status.gateway'
import { UpdateOrderUseCase } from '@/usecases/update-order-status/update-order.usecase'

export const updateOrderStatusControllerFactory = (): UpdateOrderStatusController => {
  const gateway = new UpdateOrderStatusGateway()
  const updateOrderStatusUseCase = new UpdateOrderUseCase(gateway)
  return new UpdateOrderStatusController(updateOrderStatusUseCase)
}
