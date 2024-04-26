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
  MESSAGE_GROUP_ID: 'payment',
  MESSAGE_DUPLICATION_ID: 'payment',
  CARD_ENCRYPTOR_MICROSSERVICE: {
    URL: ''
  }
}
