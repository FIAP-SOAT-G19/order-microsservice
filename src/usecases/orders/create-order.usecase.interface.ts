import { ProductEntity } from '@/entities/products/product.entity'

export type CreateOrderInput = {
  status: string
  totalValue: number
  createdAt: Date
  clientId?: string
  clientDocument?: string
  products: ProductEntity []
}

export interface CreateOrderUseCaseInterface {
  execute: (input: CreateOrderInput) => Promise<string>
}
