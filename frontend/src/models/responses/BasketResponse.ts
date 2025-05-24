import {Filling} from "./Filling";
import {Decor} from "./Decor";

export interface BasketResponse {
    id: number
    product_name: string
    weight: number,
    price: number,
    count: number,
    id_product: number
    image: string,
    details: ProductDetails | null;
}

export interface ProductDetails {
    fillings: Filling[];
    decors: Decor[];
}
