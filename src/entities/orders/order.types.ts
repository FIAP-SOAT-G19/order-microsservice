export enum OrderStatus {
  waitingPayment = 'waitingPayment',
  received = 'received',
  InPreparation = 'InPreparation',
  prepared = 'prepared',
  finalized = 'finalized',
  canceled = 'canceled'
}

export type OrderData = {
  id: string
  orderNumber: string
  status: string
  totalValue: number
  createdAt?: Date
  updatedAt?: Date
  paidAt?: Date
  clientId?: string
  clientDocument?: string
}
