export interface UpdateOrderUseCaseInterface {
  execute: (orderNumber: string, status: string) => Promise<void>
}
