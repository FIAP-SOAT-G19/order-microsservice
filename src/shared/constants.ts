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
    URL: process.env.CARD_ENCRYPTOR_MICROSSERVICE_URL!
  }
}
