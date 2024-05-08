export interface QueueInterface {
  sendMessage: (queueName: string, message: string, messageGroupId: string, messageDeduplicationId: string) => Promise<boolean>
}
