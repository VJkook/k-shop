import {Image} from "./Image";

export interface ReadyCake {
    composition: string | null
    description: string | null
    id: number
    id_product: number
    images: Image[]
    name: string
    price: number,
    weight: number | null
}
