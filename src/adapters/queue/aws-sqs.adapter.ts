import { SendMessageRequest, SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { QueueInterface } from './queue.interface'
import constants from '@/shared/constants'

export class AwsSqsAdapter implements QueueInterface {
  private readonly client: SQSClient

  constructor() {
    this.client = this.getClient()
  }

  async sendMessage (queueName: string, message: string): Promise<boolean> {
    const input: SendMessageRequest = {
      QueueUrl: queueName,
      MessageBody: message,
      MessageGroupId: constants.MESSAGE_GROUP_ID,
      MessageDeduplicationId: constants.MESSAGE_DUPLICATION_ID
    }

    const command = new SendMessageCommand(input)
    const sendMessage = await this.client.send(command)

    return !!sendMessage
  }

  private getClient (): SQSClient {
    return new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
      }
    })
  }
}
