import { CreateOrderController } from '@/adapters/controllers/orders/create-order.controller'
import { CreateOrderGateway } from '@/adapters/gateways/orders/order.gateway'
import { UUIDAdapter } from '@/adapters/tools/crypto/uuid.adapter'
import { CreateOrderUseCase } from '@/usecases/orders/create-order.usecase'

export const createOrderControllerFactory = (): CreateOrderController => {
  const gateway = new CreateOrderGateway()
  const uuidAdapter = new UUIDAdapter()
  const createOrderUseCase = new CreateOrderUseCase(gateway, uuidAdapter)
  return new CreateOrderController(createOrderUseCase)
}
