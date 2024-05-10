import { mock } from 'jest-mock-extended'
import { HttpRequest } from '../controller.interface'
import { ListOrderByOrderNumberController } from './list-order-by-order-number.controller'
import { ListOrderByOrderNumberUseCaseInterface } from '@/usecases/list-order-by-order-number/list-order-by-orderNumber.usecase.interface'
import { serverError } from '@/shared/helpers/http.helper'

const listOrderByOrderNumberUseCase = mock<ListOrderByOrderNumberUseCaseInterface>()
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

describe('ListOrderByOrderNumberController', () => {
  let sut: ListOrderByOrderNumberController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListOrderByOrderNumberController(listOrderByOrderNumberUseCase)
    input = {
      params: {
        orderNumber: 'anyOrderNumber'
      }
    }
    listOrderByOrderNumberUseCase.execute.mockResolvedValue(fakeOrder)
  })

  test('should call listOrderByOrderNumberUseCase.execute once and with correct orderNumber', async () => {
    await sut.execute(input)

    expect(listOrderByOrderNumberUseCase.execute).toHaveBeenCalledTimes(1)
    expect(listOrderByOrderNumberUseCase.execute).toHaveBeenCalledWith('anyOrderNumber')
  })

  test('should return a corretct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: fakeOrder })
  })

  test('should return a correct error if listOrderByOrderNumberUseCase throws', async () => {
    const error = new Error('Internal server error')
    listOrderByOrderNumberUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(error))
  })
})
