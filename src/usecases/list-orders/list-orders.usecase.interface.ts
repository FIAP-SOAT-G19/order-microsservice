export type ListOrderOutput = {
  order: Order
  products: Product []
  client?: Client
}

export type Order = {
  id: string
  orderNumber: string
  status: string
  totalValue: number
  paidAt: Date | null
  clientId?: string
  clientDocument?: string
}

export type Product = {
  name: string
  amount: number
  price: number
}

export type Client = {
  name: string
}

export interface ListOrdersUseCaseInterface {
  execute: () => Promise<ListOrderOutput[] | null>
}
