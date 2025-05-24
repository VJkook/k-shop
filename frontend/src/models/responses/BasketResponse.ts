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
}

export interface BasketItem {
    id: number;
    product_name: string;
    weight: number;
    price: number | null;
    count: number;
    id_product: number;
    image: string | null;
    details: BasketItemDetails | null;
}

type BasketResponse = BasketItem[];
