import { CreateOrderUseCase } from './create-order.usecase'
import { ProductEntity } from '../../entities/products/product.entity'
import { OrderEntity } from '@/entities/orders/order.entity'
import { OrderGatewayInterface } from '@/adapters/gateways/orders/order.gateway.interface'
import { UUIDAdapter } from '@/adapters/tools/uuid.adapter'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { InvalidParamError } from '@/shared/errors'

const gateway = mock<OrderGatewayInterface>()
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
          name: 'Product 1',
          category: 'accompaniment',
          price: 2000,
          description: 'Product 1 description',
          image: 'http://uri.com/product1.png',
          amount: 2

        },
        {
          name: 'Product 2',
          category: 'accompaniment',
          price: 2000,
          description: 'Product 2 description',
          image: 'http://uri.com/product2.png',
          amount: 2

        }
      ],
      createdAt: new Date()
    }

    gateway.createOrder.mockResolvedValue(fakeOrder)
    gateway.getProductById.mockResolvedValue(fakeProduct)
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

  test('should make a Product correctly', async () => {
    const spy = jest.spyOn(ProductEntity, 'build')
    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(2)
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

  test('should return a orderNumber on success', async () => {
    const output = await sut.execute(input)

    expect(output).toBe('AnyOrderNumber')
  })

  test('should call gateway.createOrderProduct with correct values', async () => {
    await sut.execute(input)
    expect(gateway.createOrderProduct).toHaveBeenCalledTimes(2)
  })

  test('should call gateway.getProductById', async () => {
    await sut.execute(input)
    expect(gateway.getProductById).toHaveBeenCalledTimes(2)
  })

  test('should throwan exception if a invalid product is provided', async () => {
    gateway.getProductById.mockResolvedValueOnce(null)
    await expect(sut.execute(input)).rejects.toThrow(new InvalidParamError('productId'))
  })
})
