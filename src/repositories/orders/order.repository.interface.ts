export type OrderRepositoryInput = {
  id: string
  status: string
  totalValue: number
  createdAt: Date
  orderNumber: string
  updatedAt: Date | null
  paidAt?: Date
  clientId?: string
  clientDocument?: string
}

export type OrderRepositoryOutput = {
  id: string
  status: string
  totalValue: number
  createdAt: Date
  orderNumber: string
  updatedAt?: Date
  paidAt?: Date
  clientId?: string
  clientDocument?: string
}

export interface OrderRepositoryInterface {
  create: (input: OrderRepositoryInput) => Promise<OrderRepositoryOutput>
}
