import { ClientEntity } from '@/entities/clients/client.entity'
import { OrderEntity } from '@/entities/orders/order.entity'

export type CreateOrderInput = {
  status: string
  totalValue: number
  createdAt: Date
  clientId?: string
  clientDocument?: string
  products: ProductInput []
  payment: PaymentInput
}

export type ProductInput = {
  id: string
  price: number
  amount: number
}

export type PaymentInput = {
  creditCard: CreditCardInput
}

export type CreditCardInput = {
  brand: string
  number: string
  cvv: string
  expiryMonth: string
  expiryYear: string
}

export type HandleOrderOutput = {
  order: OrderEntity
  client: ClientEntity | null
}

export type ProductMessageInput = {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  amount: number
  createdAt: Date
  updatedAt?: Date
}

export interface CreateOrderUseCaseInterface {
  execute: (input: CreateOrderInput) => Promise<string>
}
