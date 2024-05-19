export type ListOrderByOrderNumberOutput = {
  order: OrderOutput
  products: Product []
  client?: Client
}

type OrderOutput = {
  id: string
  orderNumber: string
  status: string
  totalValue: number
  paidAt: Date | null
  clientId?: string
  clientDocument?: string
}

type Product = {
  name: string
  amount: number
  price: number
}

type Client = {
  name: string
}

export interface ListOrderByOrderNumberUseCaseInterface {
  execute: (orderNumber: string) => Promise<ListOrderByOrderNumberOutput | null>
}
