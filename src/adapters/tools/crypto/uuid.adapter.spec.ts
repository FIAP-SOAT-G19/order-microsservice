import { UUIDAdapter } from './uuid.adapter'
import { randomUUID } from 'crypto'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('anyUUID')
}))

describe('UUIDAdapter', () => {
  let sut: UUIDAdapter

  beforeAll(() => {
    sut = new UUIDAdapter()
  })
  test('should call randomUUID once', () => {
    sut.generate()

    expect(randomUUID).toHaveBeenCalledTimes(1)
  })

  test('should return a correct UUID', () => {
    const uuid = sut.generate()

    expect(uuid).toBe('anyUUID')
  })
})
