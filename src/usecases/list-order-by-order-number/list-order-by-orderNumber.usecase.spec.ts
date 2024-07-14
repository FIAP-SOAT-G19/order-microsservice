import { InvalidParamError } from '@/shared/errors'
import { ListOrderByOrderNumberUseCase } from './list-order-by-orderNumber.usecase'
import { mock } from 'jest-mock-extended'
import { ListOrderByOrderNumberGatewayInterface } from '@/adapters/gateways/list-order-by-order-number/list-order-by-order-number.gateway.interface'

const gateway = mock<ListOrderByOrderNumberGatewayInterface>()
const fakeOrder = {
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
}

describe('ListOrderByOrderNumberUseCase', () => {
  let sut: ListOrderByOrderNumberUseCase
  let orderNumber: string

  beforeEach(() => {
    sut = new ListOrderByOrderNumberUseCase(gateway)
    orderNumber = 'anyOrderNumber'
    gateway.listOrderByOrderNumber.mockResolvedValue(fakeOrder)
  })

  test('should throw if a invalid orderNumber is provided', async() => {
    await expect(sut.execute(null as any)).rejects.toThrow(new InvalidParamError('orderNumber'))
  })

  test('should call gateway.listOrderByOrderNumber once and with correct orderNumber', async () => {
    await sut.execute(orderNumber)

    expect(gateway.listOrderByOrderNumber).toHaveBeenCalledTimes(1)
    expect(gateway.listOrderByOrderNumber).toHaveBeenCalledWith('anyOrderNumber')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(orderNumber)

    expect(output).toEqual(fakeOrder)
  })

  test('should return a correct output', async () => {
    gateway.listOrderByOrderNumber.mockResolvedValueOnce(null)

    const output = await sut.execute(orderNumber)

    expect(output).toEqual(null)
  })
})
