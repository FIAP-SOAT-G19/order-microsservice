import { InvalidParamError, OrderNotFoundError } from '@/shared/errors'
import { ListOrderStatusUseCase } from './list-order-status.usecase'
import { mock } from 'jest-mock-extended'
import { ListOrderStatusGatewayInterface } from '@/adapters/gateways/list-order-status/list-order-status.gateway.interface'

const gateway = mock<ListOrderStatusGatewayInterface>()

describe('ListOrderStatusUseCase', () => {
  let sut: ListOrderStatusUseCase
  let orderNumber: string

  beforeEach(() => {
    sut = new ListOrderStatusUseCase(gateway)
    orderNumber = 'anyOrderNumber'

    gateway.getOrderByOrderNumber.mockResolvedValue({
      id: 'anyOrderId',
      orderNumber: 'anyOrderNumber',
      status: 'received',
      totalValue: 500,
      clientDocument: 'anyDocument',
      clientId: 'anyClientId',
      createdAt: new Date()
    })
  })

  test('should throw if orderNumber is not provided or invalid', async () => {
    await expect(sut.execute(null as any)).rejects.toThrow(new InvalidParamError('orderNumber'))
  })

  test('should call gateway.getOrderByOrderNumber once and with correct orderNumber', async () => {
    await sut.execute(orderNumber)

    expect(gateway.getOrderByOrderNumber).toHaveBeenCalledTimes(1)
    expect(gateway.getOrderByOrderNumber).toHaveBeenCalledWith('anyOrderNumber')
  })

  test('should throw if order does not exists', async () => {
    gateway.getOrderByOrderNumber.mockResolvedValueOnce(null)
    await expect(sut.execute(orderNumber)).rejects.toThrow(new OrderNotFoundError())
  })

  test('shold return a correct order status', async () => {
    const output = await sut.execute(orderNumber)

    expect(output).toBe('received')
  })
})
