import { isValidString } from '@/shared/helpers/string.helper'
import { ClientData } from './client.entity.types'
import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export class ClientEntity {
  constructor(
    public readonly id: string,
    public readonly identifier: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date
  ) {}

  public static build (clientData: ClientData): ClientEntity {
    this.validateRequiredFields(clientData)
    return this.create(clientData)
  }

  private static validateRequiredFields (clientData: ClientData): void {
    const requiredFields: Array<keyof Omit<ClientData, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> = ['identifier', 'name', 'email', 'cpf']
    requiredFields.forEach(field => {
      if (!isValidString(clientData[field])) {
        throw new MissingParamError(field)
      }
    })
  }

  private static create (clientData: ClientData): ClientEntity {
    const { identifier, name, email, cpf } = clientData

    const id = clientData.id ?? randomUUID()
    const createdAt = clientData.createdAt ?? new Date()
    const updatedAt = clientData.updatedAt ?? undefined
    const deletedAt = clientData.deletedAt ?? undefined

    return new ClientEntity(id, identifier, name, email, cpf, createdAt, updatedAt, deletedAt)
  }
}
