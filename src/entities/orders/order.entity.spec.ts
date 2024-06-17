import { InvalidParamError } from '@/shared/errors'
import { OrderEntity } from './order.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('AnyId'),
  randomBytes: jest.fn()
}))

describe('OrderEntity', () => {
  let input: any
  let sut: any

  beforeEach(() => {
    sut = OrderEntity
    input = {
      status: 'waitingPayment',
      totalValue: 2500,
      createdAt: new Date(),
      clientId: 'anyClientId',
      clientDocument: 'anyClientDocument'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if a invalid status is provided', () => {
    input.status = 'invalidStatus'

    expect(() => {
      sut.build(input)
    }).toThrow(new InvalidParamError('status'))
  })

  test('should throw if a invalid totalValue is provided', () => {
    input.totalValue = -1

    expect(() => {
      sut.build(input)
    }).toThrow(new InvalidParamError('totalValue'))
  })

  test('should make a correct Order Entity', () => {
    jest.spyOn(sut, 'orderNumberGenerate').mockReturnValueOnce('anyOrderNumber')

    const order = sut.build(input)

    expect(order).toEqual({
      id: 'AnyId',
      orderNumber: 'anyOrderNumber',
      status: 'waitingPayment',
      totalValue: 2500,
      createdAt: new Date(),
      clientId: 'anyClientId',
      clientDocument: 'anyClientDocument'
    })
  })

  test('should make a correct Order Entity wihtout clientId', () => {
    input.clientId = undefined
    jest.spyOn(sut, 'orderNumberGenerate').mockReturnValueOnce('anyOrderNumber')

    const order = sut.build(input)

    expect(order).toEqual({
      id: 'AnyId',
      orderNumber: 'anyOrderNumber',
      status: 'waitingPayment',
      totalValue: 2500,
      createdAt: new Date(),
      clientDocument: 'anyClientDocument'
    })
  })

  test('should make a correct Order Entity wihtout clientDocument', () => {
    input.clientDocument = undefined
    jest.spyOn(sut, 'orderNumberGenerate').mockReturnValueOnce('anyOrderNumber')

    const order = sut.build(input)

    expect(order).toEqual({
      id: 'AnyId',
      orderNumber: 'anyOrderNumber',
      status: 'waitingPayment',
      totalValue: 2500,
      createdAt: new Date(),
      clientId: 'anyClientId'
    })
  })

  test('should make a correct Order Entity wihtout createdAt', () => {
    input.createdAt = undefined
    jest.spyOn(sut, 'orderNumberGenerate').mockReturnValueOnce('anyOrderNumber')

    const order = sut.build(input)

    expect(order).toEqual({
      id: 'AnyId',
      orderNumber: 'anyOrderNumber',
      status: 'waitingPayment',
      totalValue: 2500,
      createdAt: new Date(),
      clientId: 'anyClientId',
      clientDocument: 'anyClientDocument'
    })
  })

  test('should generate a valid order number with expected length and format', () => {
    const orderNumber: string = sut.orderNumberGenerate()

    // Verifica se o número de pedido tem o comprimento esperado
    expect(orderNumber.length).toBeGreaterThan(0)
    expect(orderNumber.length).toBeLessThanOrEqual(20) // comprimento máximo possível do número de pedido (6 caracters alfanumericos + hifen + 13 numeros to timestamp)

    // Verifica se o formato do número de pedido está correto
    const regex: RegExp = /^[A-Z0-9]{6}-\d+$/ // formato esperado: XXXXX-XXXXXXXXXXXX
    expect(regex.test(orderNumber)).toBe(true)
  })

  test('should generate unique order numbers', () => {
    const orderNumber1: string = sut.orderNumberGenerate()
    const orderNumber2: string = sut.orderNumberGenerate()

    // Verifica se os números de pedido gerados são diferentes
    expect(orderNumber1).not.toBe(orderNumber2)
  })
})
