import { mock } from 'jest-mock-extended'
import { ListOrdersUseCase } from './list-orders.usecase'
import { ListOrdersGatewayInterface } from '@/adapters/gateways/list-orders/list-orders.gateway.interface'

const gateway = mock<ListOrdersGatewayInterface>()
const fakeOrders = [{
  order: {
    id: 'anyOrderId',
    orderNumber: 'anyOrderNumber',
    status: 'received',
    paidAt: new Date(),
    totalValue: 5000
  },
  products: [{
    name: 'anyProduct',
    amount: 1,
    price: 2500
  }, {
    name: 'anotherProduct',
    amount: 1,
    price: 2500
  }],
  client: {
    name: 'anyClientName'
  }
}]

describe('ListOrdersUseCase', () => {
  let sut: ListOrdersUseCase

  beforeEach(() => {
    sut = new ListOrdersUseCase(gateway)

    gateway.listOrders.mockResolvedValue(fakeOrders)
  })

  test('should call gateway once', async () => {
    await sut.execute()

    expect(gateway.listOrders).toHaveBeenCalledTimes(1)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute()

    expect(output).toEqual(fakeOrders)
  })

  test('should return a correct output', async () => {
    gateway.listOrders.mockResolvedValueOnce(null)

    const output = await sut.execute()

    expect(output).toEqual(null)
  })
})
