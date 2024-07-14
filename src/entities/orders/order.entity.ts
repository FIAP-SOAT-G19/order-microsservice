import { InvalidParamError } from '@/shared/errors'
import { OrderData, OrderStatus } from './order.types'
import { randomUUID } from 'crypto'

export class OrderEntity {
  constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly totalValue: number,
    public readonly createdAt: Date,
    public readonly orderNumber: string,
    public readonly updatedAt?: Date,
    public readonly paidAt?: Date,
    public readonly clientId?: string,
    public readonly clientDocument?: string
  ) {}

  public static build (orderData: OrderData): OrderEntity {
    this.validate(orderData)
    return this.create(orderData)
  }

  private static validate (orderData: OrderData): void {
    if (!Object.values(OrderStatus).includes(orderData.status as OrderStatus)) {
      throw new InvalidParamError('status')
    }

    if (!orderData.totalValue || orderData.totalValue < 0) {
      throw new InvalidParamError('totalValue')
    }
  }

  private static create (orderData: OrderData): OrderEntity {
    const { status, totalValue } = orderData

    const id = orderData.id ?? randomUUID()
    const orderNumber = orderData.orderNumber ?? this.orderNumberGenerate()
    const createdAt = orderData.createdAt ?? new Date()
    const updatedAt = orderData.updatedAt ?? undefined
    const paidAt = orderData.paidAt ?? undefined
    const clientId = orderData.clientId ?? undefined
    const clientDocument = orderData.clientDocument ?? undefined

    return new OrderEntity(id, status, totalValue, createdAt, orderNumber, updatedAt, paidAt, clientId, clientDocument)
  }

  private static orderNumberGenerate (): string {
    const max: number = 5
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVXWYZ0123456789'
    let str: string = ''

    for (let i = 0; i <= max; i++) {
      str += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    const timeStamp = new Date().getTime()
    return `${str}-${timeStamp}`
  }
}
