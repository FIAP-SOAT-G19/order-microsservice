import { MissingParamError } from '@/shared/errors'
import { ClientEntity } from './client.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('AnyId')
}))

describe('ClientEntity', () => {
  let input: any
  let sut: any

  beforeEach(() => {
    sut = ClientEntity
    input = {
      identifier: 'anyIdentifier',
      name: 'AnyClientName',
      email: 'anyEmail@email.com',
      cpf: 'anyCPF'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if any required field does not provided', () => {
    const requiredFields = ['identifier', 'name', 'email', 'cpf']

    for (const field of requiredFields) {
      input[field] = null

      expect(() => {
        sut.build(input)
      }).toThrow(new MissingParamError(field))

      input[field] = field
    }
  })

  test('should make a correct Client Entity', () => {
    const client = sut.build(input)

    expect(client).toEqual({
      id: 'AnyId',
      identifier: 'anyIdentifier',
      name: 'AnyClientName',
      email: 'anyEmail@email.com',
      cpf: 'anyCPF',
      createdAt: new Date()
    })
  })
})
