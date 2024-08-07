import { logger } from '@/shared/helpers/logger.helper'
import { AwsSqsAdapter } from './aws-sqs.adapter'
import { UpdateOrderStatusGateway } from '../gateways/update-order-status/update-order-status.gateway'
import { UpdateOrderUseCase } from '@/usecases/update-order-status/update-order.usecase'
import { OrderNotFoundError } from '@/shared/errors'

export const processMessagesOnQueue = async (): Promise<void> => {
  while (true) {
    try {
      await processedPaymentsQueues([process.env.QUEUE_UPDATE_ORDER_FIFO!, process.env.QUEUE_UNAUTHORIZED_PAYMENT!])
    } catch (error: any) {
      logger.error(`Error processing queue message, ${error}`)
    }
  }
}

const processedPaymentsQueues = async (queues: string []): Promise<void> => {
  for (const queueName of queues) {
    await updateOrderStatus(queueName)
  }
}

const updateOrderStatus = async (queueName: string): Promise<any> => {
  const queue = new AwsSqsAdapter()
  const messages = await queue.receiveMessage(queueName, 1, 20)

  if (!messages || messages.length === 0) {
    return null
  }

  for (const message of messages) {
    try {
      const { orderNumber, status } = JSON.parse(message.Body)
      const gateway = new UpdateOrderStatusGateway()
      const updateOrderUseCase = new UpdateOrderUseCase(gateway)
      await updateOrderUseCase.execute(orderNumber, status)
      await queue.deleteMessage(queueName, message.ReceiptHandle, message.MessageId)
    } catch (error) {
      if (error instanceof OrderNotFoundError) {
        await queue.deleteMessage(queueName, message.ReceiptHandle, message.MessageId)
      }
    }
  }

  await new Promise(resolve => setTimeout(resolve, 1000))
}
