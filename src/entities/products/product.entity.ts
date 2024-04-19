import { isValidString } from '@/shared/helpers/string.helper'
import { ProductCategory, ProductData } from './product.types'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { isValidNumber } from '@/shared/helpers/number.helper'
import { randomUUID } from 'crypto'

export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string,
    public readonly price: number,
    public readonly description: string,
    public readonly image: string,
    public readonly amount: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  public static build (productData: ProductData): ProductEntity {
    this.validate(productData)
    return this.create(productData)
  }

  private static validate (productData: ProductData): void {
    this.validateRequiredFields(productData)
    this.validateCategory(productData.category)
    this.validatePriceAndAmount(productData.price, productData.amount)
  }

  private static validateRequiredFields (productData: ProductData): void {
    const requiredFields: Array<keyof Omit<ProductData, 'price' | 'amount' | 'createdAt' | 'updatedAt'>> = ['name', 'category', 'description', 'image']
    requiredFields.forEach(field => {
      if (!isValidString(productData[field])) {
        throw new MissingParamError(field)
      }
    })
  }

  private static validateCategory (category: string): void {
    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      throw new InvalidParamError('category')
    }
  }

  private static validatePriceAndAmount (price: number, amount: number): void {
    if (!isValidNumber(price)) {
      throw new InvalidParamError('price')
    }

    if (!isValidNumber(amount)) {
      throw new InvalidParamError('amount')
    }
  }

  private static create(productData: ProductData): ProductEntity {
    const { name, category, price, description, image, amount } = productData

    const id = productData.id ?? randomUUID()
    const createdAt = productData.createdAt ?? new Date()
    const updatedAt = productData.updatedAt ?? undefined

    return new ProductEntity(id, name, category, price, description, image, amount, createdAt, updatedAt)
  }
}
