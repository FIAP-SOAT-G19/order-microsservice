import { CreateOrderController } from '@/adapters/controllers/orders/create-order.controller'
import { CreateOrderGateway } from '@/adapters/gateways/orders/order.gateway'
import { Cryptodapter } from '@/adapters/tools/crypto/crypto.adapter'
import { CreateOrderUseCase } from '@/usecases/orders/create-order.usecase'

export const createOrderControllerFactory = (): CreateOrderController => {
  const gateway = new CreateOrderGateway()
  const cryptodapter = new Cryptodapter()
  const createOrderUseCase = new CreateOrderUseCase(gateway, cryptodapter)
  return new CreateOrderController(createOrderUseCase)
}
