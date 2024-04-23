import { CreateOrderUseCase } from './create-order.usecase'
import { OrderEntity } from '@/entities/orders/order.entity'
import { CreateOrderGatewayInterface } from '@/adapters/gateways/orders/order.gateway.interface'
import { UUIDAdapter } from '@/adapters/tools/crypto/uuid.adapter'
import { InvalidParamError } from '@/shared/errors'
import MockDate from 'mockdate'
import { mock } from 'jest-mock-extended'

const gateway = mock<CreateOrderGatewayInterface>()
const uuid = mock<UUIDAdapter>()

const fakeOrder = {
  id: 'AnyOrderId',
  status: 'waitingPayment',
  totalValue: 8000,
  createdAt: new Date(),
  orderNumber: 'AnyOrderNumber',
  clientId: 'AnyCliendId',
  clientDocument: 'AnyClientDocument'
}

const fakeProduct = {
  id: 'product_id_1',
  name: 'Product 1',
  category: 'accompaniment',
  price: 2000,
  description: 'Product 1 description',
  image: 'http://uri.com/product1.png',
  amount: 2,
  createdAt: new Date()
}

const fakeClient = {
  id: 'AnyId',
  identifier: 'anyIdentifier',
  name: 'AnyClientName',
  email: 'anyEmail@email.com',
  cpf: 'anyCPF',
  createdAt: new Date()
}

describe('CreateOrderUseCase', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = new CreateOrderUseCase(gateway, uuid)
    input = {
      status: 'waitingPayment',
      clientId: 'AnyCliendId',
      clientDocument: 'AnyClientDocument',
      products: [
        {
          id: 'idProduct1',
          price: 2000,
          amount: 2

        },
        {
          id: 'idProduct2',
          price: 2000,
          amount: 2

        }
      ],
      createdAt: new Date()
    }

    gateway.getProductById.mockResolvedValue(fakeProduct)
    gateway.getClientById.mockResolvedValue(fakeClient)

    uuid.generate.mockReturnValue('AnyId')

    jest.spyOn(OrderEntity, 'build').mockReturnValue(fakeOrder)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
    jest.clearAllMocks()
  })

  test('should call calculateTotalValue once and with correct products', async () => {
    const spy = jest.spyOn(sut, 'calculateTotalValue')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should calculate totalValue correctly', async () => {
    const totalValue = sut.calculateTotalValue(input.products)
    expect(totalValue).toBe(8000)
  })

  test('should make a correct Order correctly', async () => {
    const spy = jest.spyOn(OrderEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should call gateway.createOrder once and with correct values', async () => {
    await sut.execute(input)

    expect(gateway.createOrder).toHaveBeenCalledTimes(1)
    expect(gateway.createOrder).toHaveBeenCalledWith(fakeOrder)
  })

  test('should call gateway.createOrderProduct with correct values', async () => {
    await sut.execute(input)
    expect(gateway.createOrderProduct).toHaveBeenCalledTimes(2)
  })

  test('should call gateway.getProductById', async () => {
    await sut.execute(input)
    expect(gateway.getProductById).toHaveBeenCalledTimes(2)
  })

  test('should throw an exception if a invalid product is provided', async () => {
    gateway.getProductById.mockResolvedValueOnce(null)
    await expect(sut.execute(input)).rejects.toThrow(new InvalidParamError('productId'))
  })

  test('should call gateway.getClientById once and with correct clientId', async () => {
    await sut.execute(input)

    expect(gateway.getClientById).toHaveBeenCalledTimes(1)
    expect(gateway.getClientById).toHaveBeenCalledWith('AnyCliendId')
  })

  test('should throw an exception if a invalid clientId is provided', async () => {
    gateway.getClientById.mockResolvedValueOnce(null)
    await expect(sut.execute(input)).rejects.toThrow(new InvalidParamError('clientId'))
  })

  test('should return a orderNumber on success', async () => {
    const output = await sut.execute(input)

    expect(output).toBe('AnyOrderNumber')
  })
})
