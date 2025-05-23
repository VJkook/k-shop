import {Image} from "./Image";

export interface Filling {
    id: number
    name: string
    description: string|null
    price_by_kg: string
    image: Image
}
