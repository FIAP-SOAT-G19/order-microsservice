import { mock } from 'jest-mock-extended'
import { ListOrdersController } from './list-orders.controller'
import { ListOrdersUseCaseInterface } from '@/usecases/list-orders/list-orders.usecase.interface'
import { serverError } from '@/shared/helpers/http.helper'
import { ServerError } from '@/shared/errors'

const listOrderUseCase = mock<ListOrdersUseCaseInterface>()
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

describe('ListOrdersController', () => {
  let sut: ListOrdersController

  beforeEach(() => {
    sut = new ListOrdersController(listOrderUseCase)
    listOrderUseCase.execute.mockResolvedValue(fakeOrders)
  })

  test('should call listOrdersUseCase', async () => {
    await sut.execute()

    expect(listOrderUseCase.execute).toHaveBeenCalledTimes(1)
  })

  test('should return a corretct output', async () => {
    const output = await sut.execute()

    expect(output).toEqual({ statusCode: 200, body: fakeOrders })
  })

  test('should return a correct error if listOrderUseCase throws', async () => {
    const error = new Error('Internal server error')
    listOrderUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute()

    expect(output).toEqual(serverError(new ServerError(error)))
  })
})
