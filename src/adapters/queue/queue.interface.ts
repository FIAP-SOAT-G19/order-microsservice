export interface QueueInterface {
  sendMessage: (queueName: string, message: string) => Promise<boolean>
}
