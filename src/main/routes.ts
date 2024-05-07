import { expressRouteAdapter } from '@/adapters/tools/express/express.adapter'
import { createOrderControllerFactory } from './factories/create-order-controller.factory'
import { Router } from 'express'

const router = Router()

router.post('/orders', expressRouteAdapter(createOrderControllerFactory()))

export { router }
