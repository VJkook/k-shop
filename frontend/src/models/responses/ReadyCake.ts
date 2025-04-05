import {list} from "postcss";
import {Image} from "./Image";

export interface ReadyCake {
    id: number
    name: string
    price: number
    weight: number | null
    composition: string | null
    description: string | null
    images: list<Image[]>,
    id_product: number
}
