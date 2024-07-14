export type ProductData = {
  id?: string
  name: string
  category: string
  price: number
  description: string
  image: string
  createdAt?: Date
  updatedAt?: Date
}

export enum ProductCategory {
  accompaniment = 'accompaniment',
  dessert = 'dessert',
  drink = 'drink',
  snack = 'snack',
}
