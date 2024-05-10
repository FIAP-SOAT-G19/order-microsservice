import { HttpResponse } from '@/adapters/controllers/controller.interface'
import { ClientNotFoundError, InvalidParamError, MissingParamError, OrderNotFoundError, ProductNotFoundError, SchemaValidationError } from '../errors'
import { badRequest, notFound, serverError } from './http.helper'

export const handleError = (error: any): HttpResponse => {
  if (error instanceof InvalidParamError || error instanceof MissingParamError || error instanceof SchemaValidationError) {
    return badRequest(error)
  }

  if (error instanceof ClientNotFoundError || error instanceof ProductNotFoundError || error instanceof OrderNotFoundError) {
    return notFound(error)
  }
  return serverError(error)
}
