export interface GetAllProductsResponse {
    id: string;
    name: string;
    amount: number;
    description: string;
    price: string;
    category_id: {
        id: string;
        name: string;
    }
}