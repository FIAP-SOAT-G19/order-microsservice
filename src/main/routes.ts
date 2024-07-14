import { expressRouteAdapter } from '@/adapters/tools/express/express.adapter'
import { createOrderControllerFactory } from './factories/create-order-controller.factory'
import { listOrderStatusControllerFactory } from './factories/list-order-status.factory'
import { updateOrderStatusControllerFactory } from './factories/update-order-status-controller.factory'
import { listOrderByOrderNumberControllerFactory } from './factories/list-order-by-order-number-controller.factory'
import { listOrderControllerFactory } from './factories/list-orders.factory'
import { Router } from 'express'

const router = Router()

router.post('/orders', expressRouteAdapter(createOrderControllerFactory()))
router.get('/orders/:orderNumber/status', expressRouteAdapter(listOrderStatusControllerFactory()))
router.get('/orders/:orderNumber', expressRouteAdapter(listOrderByOrderNumberControllerFactory()))
router.patch('/orders/:orderNumber', expressRouteAdapter(updateOrderStatusControllerFactory()))
router.get('/orders', expressRouteAdapter(listOrderControllerFactory()))

export { router }
