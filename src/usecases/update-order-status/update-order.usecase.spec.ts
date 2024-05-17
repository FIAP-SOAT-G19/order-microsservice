import { mock } from 'jest-mock-extended'
import { UpdateOrderUseCase } from './update-order.usecase'
import { UpdateOrderStatusGatewayInterface } from '@/adapters/gateways/update-order-status/update-order-status.gateway.interface'
import { InvalidParamError, OrderNotFoundError } from '@/shared/errors'
import MockDate from 'mockdate'

const gateway = mock<UpdateOrderStatusGatewayInterface>()

describe('UpdateOrderUseCase', () => {
  let sut: UpdateOrderUseCase
  let orderNumber: string
  let status: string

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    sut = new UpdateOrderUseCase(gateway)
    orderNumber = 'anyOrderNumber'
    status = 'received'

    gateway.getOrderByOrderNumber.mockResolvedValue({
      id: 'anyOrderId',
      orderNumber: 'anyOrderNumber',
      status: 'waitingPayment',
      totalValue: 5000,
      createdAt: new Date()
    })
  })

  test('should throws if a empty orderNumber is provided', async () => {
    const promise = sut.execute('', status)

    await expect(promise).rejects.toThrow(new InvalidParamError('orderNumber'))
  })

  test('should throws if a invalid orderNumber is provided', async () => {
    gateway.getOrderByOrderNumber.mockResolvedValueOnce(null)

    const promise = sut.execute('invalidOrderNumber', status)

    await expect(promise).rejects.toThrow(new OrderNotFoundError())
  })

  test('should throws if a empty status is provided', async () => {
    const promise = sut.execute(orderNumber, '')

    await expect(promise).rejects.toThrow(new InvalidParamError('status'))
  })

  test('should throws if a invalid status is provided', async () => {
    const promise = sut.execute(orderNumber, 'invalidStatus')

    await expect(promise).rejects.toThrow(new InvalidParamError('status'))
  })

  test('should call gateway.updateOrder once and with correct values', async () => {
    await sut.execute(orderNumber, status)

    expect(gateway.updateOrderStatus).toHaveBeenCalledTimes(1)
    expect(gateway.updateOrderStatus).toHaveBeenCalledWith('anyOrderNumber', 'received', new Date())
  })

  test('should call gateway.updateOrder once and with correct values when payment unauthorized', async () => {
    await sut.execute(orderNumber, 'canceled')

    expect(gateway.updateOrderStatus).toHaveBeenCalledTimes(1)
    expect(gateway.updateOrderStatus).toHaveBeenCalledWith('anyOrderNumber', 'canceled', null)
  })
})
