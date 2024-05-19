const crypto = require('crypto')

const clientsGenerate = (amount) => {
  const clients = []

  for (let i = 1; i <= amount; i++) {
    clients.push({
      id: crypto.randomUUID(),
      identifier: identifierGenerate(),
      name: `Client Test ${i}`,
      email: `client${i}@email.com`,
      cpf: new Date().getTime().toString().slice(2),
      createdAt: new Date()
    })
  }

  return clients
}

const identifierGenerate = () => {
  const max = 5
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVXWYZ0123456789'
  let str = ''

  for (let i = 0; i <= max; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  const timeStamp = new Date().getTime()
  return `${str}-${timeStamp}`
}

module.exports = clientsGenerate
