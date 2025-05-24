import {Image} from "./Image";

export interface Coverage {
    id: number
    name: string
    description: string|null
    price: number
    image: Image
}
