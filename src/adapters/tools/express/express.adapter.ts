import { ControllerInterface, HttpRequest, HttpResponse } from '@/adapters/controllers/controller.interface'
import { prismaClient } from '@/adapters/gateways/prisma.client'
import { Request, Response } from 'express'
import { UUIDAdapter } from '../crypto/uuid.adapter'
import { obfuscateValue } from '@/shared/helpers/obfuscate-value.helper'

export const expressRouteAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const input: HttpRequest = {
      params: req?.params,
      body: req?.body,
      query: req?.query
    }

    const { statusCode, body }: HttpResponse = await controller.execute(input)

    const output = (statusCode >= 200 && statusCode < 500) ? body : { error: body.message }

    await logRequest(req, input, statusCode, output)

    res.status(statusCode).json(output)
  }
}

const logRequest = async (req: Request, input: any, statusCode: number, output: any): Promise<void> => {
  const uuidGenerator = new UUIDAdapter()
  await prismaClient.request.create({
    data: {
      id: uuidGenerator.generate(),
      method: req.method,
      input: JSON.stringify(obfuscateValue({ ...input.body })),
      route: req.url,
      createdAt: new Date(),
      status: statusCode,
      output: JSON.stringify(output),
      updatedAt: new Date()
    }
  })
}
