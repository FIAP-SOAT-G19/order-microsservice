import { ListOrderOutput } from '@/usecases/list-orders/list-orders.usecase.interface'

export interface ListOrdersGatewayInterface {
  listOrders: () => Promise<ListOrderOutput [] | null>
}
