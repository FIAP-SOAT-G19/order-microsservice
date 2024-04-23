import { IUUIDGenerator } from './uuid.adapter.interface'
import { randomUUID } from 'crypto'

export class UUIDAdapter implements IUUIDGenerator {
  generate (): string {
    return randomUUID()
  }
}
