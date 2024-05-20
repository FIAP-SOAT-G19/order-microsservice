export interface GetProductsGatewayInterface {
    getAll: () => Promise<GetProductByCategoryOutput>
}

export type GetProductByCategoryOutput = {
    id: string
    name: string
    category: string
}[]