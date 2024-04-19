import { CreateOrderUseCase } from './create-order.usecase'
import { ProductEntity } from '../../entities/products/product.entity'
import { OrderEntity } from '@/entities/orders/order.entity'
import { OrderRepositoryInterface } from '@/repositories/orders/order.repository.interface'
import { mock } from 'jest-mock-extended'

const orderRepository = mock<OrderRepositoryInterface>()

const fakeOrder = {
  id: 'AnyOrderId',
  status: 'waitingPayment',
  totalValue: 8000,
  createdAt: new Date(),
  orderNumber: 'AnyOrderNumber',
  clientId: 'AnyCliendId',
  clientDocument: 'AnyClientDocument'
}

describe('CreateOrderUseCase', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = new CreateOrderUseCase(orderRepository)
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

    orderRepository.create.mockResolvedValue(fakeOrder)

    jest.spyOn(OrderEntity, 'build').mockReturnValue(fakeOrder)
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

  test('should call OrderRepository.create once and with correct values', async () => {
    await sut.execute(input)

    expect(orderRepository.create).toHaveBeenCalledTimes(1)
    expect(orderRepository.create).toHaveBeenCalledWith(fakeOrder)
  })

  test('should return a orderNumber on success', async () => {
    const output = await sut.execute(input)

    expect(output).toBe('AnyOrderNumber')
  })
})
