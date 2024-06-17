const crypto = require('crypto')

const productsGenerate = (amount) => {
  const categories = ['snack', 'accompaniment', 'drink', 'dessert']
  const products = []

  for (let i = 1; i <= amount; i++) {
    const ramdomIndex = Math.floor(Math.random() * categories.length)
    products.push({
      id: crypto.randomUUID(),
      identifier: identifierGenerate(),
      name: `Product Test ${i}`,
      category: categories[ramdomIndex],
      description: `Product Test ${i}`,
      image: `http://host.com.br/product${i}`,
      price: i * 1000,
      createdAt: new Date()
    })
  }
  return products
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
module.exports = productsGenerate
