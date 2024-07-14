import { mock } from 'jest-mock-extended'
import { HttpRequest } from '../controller.interface'
import { UpdateOrderStatusController } from './update-order-status'
import { UpdateOrderUseCaseInterface } from '@/usecases/update-order-status/update-order.usecase.interface'
import { badRequest, serverError, success } from '@/shared/helpers/http.helper'
import { InvalidParamError, ServerError } from '@/shared/errors'

const updateOrderStatusUseCase = mock<UpdateOrderUseCaseInterface>()

describe('UpdateOrderStatusController', () => {
  let sut: UpdateOrderStatusController
  let input: HttpRequest

  beforeEach(() => {
    sut = new UpdateOrderStatusController(updateOrderStatusUseCase)
    input = {
      params: {
        orderNumber: 'anyOrderNumber'
      },
      body: {
        status: 'anyStatus'
      }
    }
  })

  test('should call updateOrderStatusUseCase onde and with correct values', async () => {
    await sut.execute(input)

    expect(updateOrderStatusUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateOrderStatusUseCase.execute).toHaveBeenCalledWith('anyOrderNumber', 'anyStatus')
  })

  test('should return a correct error if UpdateOrderStatusUseCase throws', async () => {
    const error = new Error('Internal server error')
    updateOrderStatusUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(new ServerError(error)))
  })

  test('should return a correct error if UpdateOrderStatusUseCase throws', async () => {
    const error = new InvalidParamError('Any error')
    updateOrderStatusUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })

  test('should return 204 on success', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(success(204, null))
  })
})
