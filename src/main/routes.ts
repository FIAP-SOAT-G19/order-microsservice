import { expressRouteAdapter } from '@/adapters/tools/express/express.adapter'
import { createOrderControllerFactory } from './factories/create-order-controller.factory'
import { Router } from 'express'
import { listOrderStatusControllerFactory } from './factories/list-order-status.factory'
import { updateOrderStatusControllerFactory } from './factories/update-order-status-controller.factory'
import { listOrderControllerFactory } from './factories/list-orders.factory'

const router = Router()

router.post('/orders', expressRouteAdapter(createOrderControllerFactory()))
router.get('/orders/:orderNumber/status', expressRouteAdapter(listOrderStatusControllerFactory()))
router.patch('/orders/:orderNumber', expressRouteAdapter(updateOrderStatusControllerFactory()))
router.get('/orders', expressRouteAdapter(listOrderControllerFactory()))

export { router }
