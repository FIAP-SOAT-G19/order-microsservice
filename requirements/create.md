# Cadastrar um novo pedido

> ## Caso de sucesso

1. ⛔ Salva os dados do pedido
2. ⛔ Salva os produtos do pedido
3. ⛔ Publica os dados do pedido em uma fila de mensageria
4. ⛔ Retorna status 201 com id do pedido

## Sugestão
Como o cliente pode se identificar ou não, o campo clientId pode ser opcional

> ## Exceções
1. ⛔ Retorna 400 se o id do cliente for fornecido e for inválido
2. ⛔ Retorna 400 se o valor total não for fornecido ou for inválido

> ## Exceções
1. ⛔ Retorna 500 se houver alguma falha na hora de salvar os dados

## Table Order
{
  	id: string
    orderNumber: string
    clientId: string
    clientDocument: string
    status: string
    totalValue: number
    createdAt: Date
    updatedAt: Date
    paidAt: Date
}

## Input Order {
    products: [{
      id: string
      name: string
      category: string
      price: number
      description: string
      image: string
      amount: number
    }],
    clientId?: string
  }

## Input Queue
  "type": "createdOrder",
  "orderNumber": 12345,
  "total_amount": 100,
  "items": [
    {
      "identifier": "IGU24G-1713263004147",
      "category": "drink",
      "name": "Coca cola",
      "price": 500,
      "description": "Coca cola 500 ML",
      "amount": 1,
      "total_amount": 500
    },
    {
      "identifier": "RHKPWG-1713262780234",
      "category": "snack",
      "name": "Hamburguer",
      "price": 1500,
      "description": "X-Tudo",
      "amount": 2,
      "total_amount": 3000
    }
  ]

✅
⛔
