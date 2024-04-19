import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { ProductEntity } from './product.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('AnyId')
}))

describe('ProductEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = ProductEntity
    input = {
      name: 'Coca cola',
      category: 'accompaniment',
      price: 1500,
      description: 'Lata 300 ml',
      image: 'http://url.com.br/image.png',
      amount: 1
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if any required field does not provided', () => {
    const requiredFields = ['name', 'category', 'description', 'image']

    for (const field of requiredFields) {
      input[field] = null

      expect(() => {
        sut.build(input)
      }).toThrow(new MissingParamError(field))

      input[field] = field
    }
  })

  test('should throw if a invalid category is provided', () => {
    input.category = 'invalidCategory'

    expect(() => {
      sut.build(input)
    }).toThrow(new InvalidParamError('category'))
  })

  test('should throw if a invalid price is provided', () => {
    input.price = -1

    expect(() => {
      sut.build(input)
    }).toThrow(new InvalidParamError('price'))
  })

  test('should throw if a invalid amount is provided', () => {
    input.amount = -1

    expect(() => {
      sut.build(input)
    }).toThrow(new InvalidParamError('amount'))
  })

  test('should make a correct Product Entity', () => {
    const product = sut.build(input)

    expect(product).toEqual({
      id: 'AnyId',
      name: 'Coca cola',
      category: 'accompaniment',
      price: 1500,
      description: 'Lata 300 ml',
      image: 'http://url.com.br/image.png',
      amount: 1,
      createdAt: new Date()
    })
  })
})
