export interface ListOrderStatusUseCaseInterface {
  execute: (orderNumber: string) => Promise<string>
}
