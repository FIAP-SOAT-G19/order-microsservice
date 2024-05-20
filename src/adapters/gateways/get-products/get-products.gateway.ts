import { GetProductByCategoryOutput, GetProductsGatewayInterface } from "./get-products.gateway.interface"
import { prismaClient } from '../prisma.client'

export class GetProductsGateway implements GetProductsGatewayInterface {
    async getAll(): Promise<GetProductByCategoryOutput> {
        const products = await prismaClient.product.findMany()
        if (!products) return []
        return products.map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category
        }))
    }
}