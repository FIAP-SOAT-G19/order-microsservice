export default {
  ORDER_STATUS: {
    WAITING_PAYMENT: 'waitingPayment',
    RECEIVED: 'received',
    IN_PREPARATION: 'InPreparation',
    PREPARED: 'prepared',
    FINALIZED: 'finalized',
    CANCELED: 'canceled'
  },
  QUEUE_CREATED_PAYMENT: 'https://sqs.us-east-1.amazonaws.com/975049990702/created_payment.fifo',
  QUEUE_APPROVED_PAYMENT: 'https://sqs.us-east-1.amazonaws.com/975049990702/approved_payment.fifo',
  QUEUE_UNAUTHORIZED_PAYMENT: 'https://sqs.us-east-1.amazonaws.com/975049990702/unauthorized_payment.fifo',
  MESSAGE_GROUP_ID: 'createdOrder',
  CARD_ENCRYPTOR_MICROSSERVICE: {
    URL: 'http://card_encryptor:3001/api/v1'
  }
}
