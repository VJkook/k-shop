import {Image} from "./Image";

export interface Decor {
    id: number
    name: string
    description: string|null
    price: string
    image: Image
}
