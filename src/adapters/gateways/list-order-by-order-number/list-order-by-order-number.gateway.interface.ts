import { ListOrderByOrderNumberOutput } from '@/usecases/list-order-by-order-number/list-order-by-orderNumber.usecase.interface'

export interface ListOrderByOrderNumberGatewayInterface {
  listOrderByOrderNumber: (orderNumber: string) => Promise<ListOrderByOrderNumberOutput | null>
}
