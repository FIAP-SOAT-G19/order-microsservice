export default {
  ORDER_STATUS: {
    WAITING_PAYMENT: 'waitingPayment',
    RECEIVED: 'received',
    IN_PREPARATION: 'InPreparation',
    PREPARED: 'prepared',
    FINALIZED: 'finalized',
    CANCELED: 'canceled'
  },
  MESSAGE_GROUP_ID: 'createdOrder',
  CARD_ENCRYPTOR_MICROSSERVICE: {
    URL: 'http://card_encryptor:3001/api/v1'
  }
}
