export type CreateOrderInput = {
  status: string
  totalValue: number
  createdAt: Date
  clientId?: string
  clientDocument?: string
  products: ProductInput []
}

export type ProductInput = {
  id: string
  price: number
  amount: number
}

export interface CreateOrderUseCaseInterface {
  execute: (input: CreateOrderInput) => Promise<string>
}
