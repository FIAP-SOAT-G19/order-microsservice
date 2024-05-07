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

export interface CreateOrderUseCaseInterface {
  execute: (input: CreateOrderInput) => Promise<string>
}
