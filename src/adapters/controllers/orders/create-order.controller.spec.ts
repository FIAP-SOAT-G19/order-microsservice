import { CreateOrderUseCaseInterface } from '@/usecases/orders/create-order.usecase.interface'
import { CreateOrderController } from './create-order.controller'
import { mock } from 'jest-mock-extended'
import { InvalidParamError } from '@/shared/errors'
import { success, serverError, badRequest } from '@/shared/helpers/http.helper'
import { HttpRequest } from '../controller.interface'

const createOrderUseCase = mock<CreateOrderUseCaseInterface>()

describe('CreateOrderController', () => {
  let sut: CreateOrderController
  let input: HttpRequest

  beforeAll(() => {
    sut = new CreateOrderController(createOrderUseCase)
    input = {
      body: {
        clientId: 'anyClientId',
        products: [{
          id: 'anyProductId',
          price: 2500,
          amount: 1
        }, {
          id: 'anyAnotherProductId',
          price: 1000,
          amount: 1
        }]
      }
    }
    createOrderUseCase.execute.mockResolvedValue('anyOrderNumber')
  })

  test('should call CreateOrderUseCase once and with correct values', async () => {
    await sut.execute(input)

    expect(createOrderUseCase.execute).toHaveBeenCalledTimes(1)
    expect(createOrderUseCase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a orderId on success', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(success(201, { orderNumber: 'anyOrderNumber' }))
  })

  test('should return a correct error if CreateOrderUseCase throws', async () => {
    const error = new Error('Internal server error')
    createOrderUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(error))
  })

  test('should return a correct error if CreateOrderUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    createOrderUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
