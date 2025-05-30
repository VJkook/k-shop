import {Coverage} from "./Coverage";

export interface Image {
    id: number;
    url: string;
}

export interface Filling {
    id: number;
    name: string;
    description: string | null;
    price_by_kg: number;
    image: Image;
}

export interface Decor {
    id: number;
    name: string;
    description: string | null;
    price: number;
    count: number;
    image: Image;
}

export interface Tier {
    id: number;
    filling: Filling;
    weight: number;
}

export interface BasketItemDetails {
    tiers: Tier[];
    decors: Decor[];
    coverage: Coverage;
}

export interface OrderOrBasketItem {
    id: number;
    name: string;
    weight: number;
    price: number | null;
    count: number;
    id_product: number;
    image: string | null;
    details: BasketItemDetails | null;
}

type OrderOrBasketItemsResponse = OrderOrBasketItem[];
