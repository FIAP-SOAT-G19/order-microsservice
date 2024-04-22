export type CreateOrderInput = {
  id: string
  status: string
  totalValue: number
  createdAt: Date
  orderNumber: string
  clientId?: string
  clientDocument?: string
}

export type CreateOrderOutput = {
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

export type CreateOrderProductInput = {
  id: string
  productId: string
  orderId: string
  amount: number
  productPrice: number
  createdAt: Date
}

export interface OrderGatewayInterface {
  createOrder: (input: CreateOrderInput) => Promise<CreateOrderOutput>
  createOrderProduct: (input: CreateOrderProductInput) => Promise<void>
}
