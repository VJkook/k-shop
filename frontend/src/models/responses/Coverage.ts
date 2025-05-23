import {Image} from "./Image";

export interface Coverage {
    id: number
    name: string
    description: string|null
    price: string
    image: Image
}
