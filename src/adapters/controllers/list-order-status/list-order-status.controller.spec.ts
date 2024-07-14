import { badRequest, serverError } from '@/shared/helpers/http.helper'
import { HttpRequest } from '../controller.interface'
import { ListOrderStatusController } from './list-order-status.controller'
import { ListOrderStatusUseCaseInterface } from '@/usecases/list-order-status/list-order-status.usecase.interface'
import { mock } from 'jest-mock-extended'
import { InvalidParamError, ServerError } from '@/shared/errors'

const listOrderStatusUseCase = mock<ListOrderStatusUseCaseInterface>()

describe('ListOrderStatusController', () => {
  let sut: ListOrderStatusController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListOrderStatusController(listOrderStatusUseCase)
    input = {
      params: {
        orderNumber: 'anyOrderNumber'
      }
    }

    listOrderStatusUseCase.execute.mockResolvedValue('anyStatus')
  })

  test('should call listOrderStatusUseCase once and with correct orderNumber', async () => {
    await sut.execute(input)

    expect(listOrderStatusUseCase.execute).toHaveBeenCalledTimes(1)
    expect(listOrderStatusUseCase.execute).toHaveBeenCalledWith('anyOrderNumber')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: 'anyStatus' })
  })

  test('should return a correct error if listOrderStatusUseCase throws', async () => {
    const error = new Error('Internal server error')
    listOrderStatusUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(new ServerError(error)))
  })

  test('should return a correct error if listOrderStatusUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    listOrderStatusUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
