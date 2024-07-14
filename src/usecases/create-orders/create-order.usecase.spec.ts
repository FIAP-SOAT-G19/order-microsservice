import { CreateOrderUseCase } from './create-order.usecase'
import { OrderEntity } from '@/entities/orders/order.entity'
import { CreateOrderGatewayInterface } from '@/adapters/gateways/create-order/create-order.gateway.interface'
import { Cryptodapter } from '@/adapters/tools/crypto/crypto.adapter'
import { InvalidParamError, ServerError } from '@/shared/errors'
import { logger } from '@/shared/helpers/logger.helper'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const gateway = mock<CreateOrderGatewayInterface>()
const crypto = mock<Cryptodapter>()

process.env.CREATED_ORDER_QUEUE_NAME = 'https://sqs.us-east-1.amazonaws.com/975049990702/created_order.fifo'

describe('CreateOrderUseCase', () => {
  let sut: any
  let input: any
  
  const fakeOrder = {
    id: 'AnyOrderId',
    status: 'waitingPayment',
    totalValue: 8000,
    createdAt: new Date(),
    orderNumber: 'AnyOrderNumber',
    clientId: 'AnyCliendId',
    clientDocument: 'AnyClientDocument'
  }

  const fakeClient = {
    id: 'AnyId',
    identifier: 'anyIdentifier',
    name: 'AnyClientName',
    email: 'anyEmail@email.com',
    cpf: 'anyCPF',
    createdAt: new Date('1990-01-01')
  }

  const fakeProducts = [
    {
      id: 'AnyId',
      amount: 2,
      createdAt: new Date(),
      orderId: 'AnyOrderId',
      productId: 'product_id_1',
      productPrice: 2000

    }
  ]

  beforeAll(() => {
    jest.spyOn(logger, 'info').mockImplementation(() => {})
    jest.spyOn(logger, 'error').mockImplementation(() => {})
  })
  
  beforeEach(() => {
    MockDate.set(new Date())
    sut = new CreateOrderUseCase(gateway, crypto)
    input = {
      status: 'waitingPayment',
      clientId: 'AnyCliendId',
      clientDocument: 'AnyClientDocument',
      products: [
        {
          id: 'idProduct1',
          price: 2000,
          amount: 2

        }
      ],
      payment: {
        creditCard: {
          brand: 'master',
          number: '5489387644257420',
          cvv: '685',
          expiryMonth: '01',
          expiryYear: '2026'
        }
      },
      createdAt: new Date()
    }

    gateway.getProductById.mockImplementation(async (productId: string) => {
      if (productId === 'idProduct1') {
        return {
          id: 'product_id_1',
          name: 'Product 1',
          category: 'accompaniment',
          price: 2000,
          description: 'Product 1 description',
          image: 'http://uri.com/product1.png',
          amount: 2,
          createdAt: new Date()
        }
      } else {
        return {
          id: 'product_id_2',
          name: 'Product 2',
          category: 'accompaniment',
          price: 2000,
          description: 'Product 1 description',
          image: 'http://uri.com/product1.png',
          amount: 2,
          createdAt: new Date()
        }
      }
    })

    gateway.getClientById.mockResolvedValue(fakeClient)
    gateway.sendMessageQueue.mockResolvedValue(true)
    gateway.saveCardExternal.mockResolvedValue('6fd92a9e-6a55-4c54-869a-3068e125af27')

    crypto.generateUUID.mockReturnValue('AnyId')
    crypto.encrypt.mockReturnValue('anyEncryptedData')

    jest.spyOn(OrderEntity, 'build').mockReturnValue(fakeOrder)
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
    expect(totalValue).toBe(4000)
  })

  test('should throws if products is empty', async () => {
    input.products = null

    await expect(sut.execute(input)).rejects.toThrow(new InvalidParamError('products'))
  })

  test('should make a correct Order correctly', async () => {
    const spy = jest.spyOn(OrderEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should call gateway.createOrder once and with correct values', async () => {
    await sut.execute(input)

    expect(gateway.createOrder).toHaveBeenCalledTimes(1)
    expect(gateway.createOrder).toHaveBeenCalledWith(fakeOrder, fakeProducts)
  })

  test('should call gateway.getProductById', async () => {
    await sut.execute(input)
    expect(gateway.getProductById).toHaveBeenCalledTimes(1)
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

  test('should throw an exception if credit card invalid is not provided', async () => {
    const requiredFields = ['number', 'brand', 'cvv', 'expiryMonth', 'expiryYear']

    for (const field of requiredFields) {
      input.payment.creditCard[field] = null

      await expect(sut.execute(input)).rejects.toThrow(new InvalidParamError(`payment.creditCard.${field}`))

      input.payment.creditCard[field] = field
    }
  })

  test('should return a orderNumber on success', async () => {
    const output = await sut.execute(input)

    expect(output).toBe('AnyOrderNumber')
  })

  test('should call gateway.sendMessageQueue once and with correct values', async () => {
    const queueName = 'https://sqs.us-east-1.amazonaws.com/975049990702/created_order.fifo'
    const body = JSON.stringify({
      orderNumber: 'AnyOrderNumber',
      totalValue: 8000,
      cardIdentifier: '6fd92a9e-6a55-4c54-869a-3068e125af27',
      products: [{
        id: 'product_id_1',
        name: 'Product 1',
        category: 'accompaniment',
        price: 2000,
        description: 'Product 1 description',
        image: 'http://uri.com/product1.png',
        amount: 2,
        createdAt: new Date()
      }],
      client: {
        id: 'AnyId',
        identifier: 'anyIdentifier',
        name: 'AnyClientName',
        email: 'anyEmail@email.com',
        cpf: 'anyCPF',
        createdAt: new Date('1990-01-01')
      }
    })

    await sut.execute(input)

    expect(gateway.sendMessageQueue).toHaveBeenCalledTimes(1)
    expect(gateway.sendMessageQueue).toHaveBeenCalledWith(queueName, body, 'createdOrder', 'AnyOrderNumber')
  })

  test('should call gateway.sendMessageQueue once and with correct values when client is not provided', async () => {
    const queueName = 'https://sqs.us-east-1.amazonaws.com/975049990702/created_order.fifo'
    const body = JSON.stringify({
      orderNumber: 'AnyOrderNumber',
      totalValue: 8000,
      cardIdentifier: '6fd92a9e-6a55-4c54-869a-3068e125af27',
      products: [{
        id: 'product_id_1',
        name: 'Product 1',
        category: 'accompaniment',
        price: 2000,
        description: 'Product 1 description',
        image: 'http://uri.com/product1.png',
        amount: 2,
        createdAt: new Date()
      }],
      client: null
    })

    input.clientId = null
    input.clientDocument = null

    await sut.execute(input)

    expect(gateway.sendMessageQueue).toHaveBeenCalledTimes(1)
    expect(gateway.sendMessageQueue).toHaveBeenCalledWith(queueName, body, 'createdOrder', 'AnyOrderNumber')
  })

  test('should call gateway.createPublishedMessageLog once and with correct values', async () => {
    await sut.execute(input)

    expect(gateway.createPublishedMessageLog).toHaveBeenCalledTimes(1)
    expect(gateway.createPublishedMessageLog).toHaveBeenCalledWith({
      id: 'AnyId',
      queue: 'https://sqs.us-east-1.amazonaws.com/975049990702/created_order.fifo',
      origin: 'CreateOrderUseCase',
      message: JSON.stringify({
        orderNumber: 'AnyOrderNumber',
        totalValue: 8000,
        cardIdentifier: '6fd92a9e-6a55-4c54-869a-3068e125af27',
        products: [{
          id: 'product_id_1',
          name: 'Product 1',
          category: 'accompaniment',
          price: 2000,
          description: 'Product 1 description',
          image: 'http://uri.com/product1.png',
          amount: 2,
          createdAt: new Date()
        }],
        client: {
          id: 'AnyId',
          identifier: 'anyIdentifier',
          name: 'AnyClientName',
          email: 'anyEmail@email.com',
          cpf: 'anyCPF',
          createdAt: new Date('1990-01-01')
        }
      }),
      createdAt: new Date()
    })
  })

  test('should not call gateway.createPublishedMessageLog when publish message fails', async () => {
    gateway.sendMessageQueue.mockResolvedValueOnce(false)

    const promise = sut.execute(input)

    expect(gateway.createPublishedMessageLog).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ServerError(new Error('Error publishing message')))
  })

  test('should call gateway.saveCardExternal onde and with correct credit card', async () => {
    await sut.execute(input)

    expect(gateway.saveCardExternal).toHaveBeenCalledTimes(1)
    expect(gateway.saveCardExternal).toHaveBeenCalledWith('anyEncryptedData')
  })

  test('should call crypto.encrypt once and with correct values', async () => {
    await sut.execute(input)

    expect(crypto.encrypt).toHaveBeenCalledTimes(1)
    expect(crypto.encrypt).toHaveBeenCalledWith(input.payment.creditCard)
  })

  test('should throws if card_encryptor returns a invalid card id', async () => {
    gateway.saveCardExternal.mockResolvedValueOnce('invalidCardId')

    await expect(sut.execute(input)).rejects.toThrow(new InvalidParamError('cardIdentifier'))
  })
})
