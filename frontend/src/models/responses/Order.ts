import {Image} from "./Image";
import {ReadyCake} from "./ReadyCake";

export interface Order {
    id: number
    total_cost: number
    registration_date: string
    delivery_date: string | null
    completed_date: string | null
    delivery_address: string
    status: string
    payment_status: string
    ready_cakes: ReadyCake[]
    name: string
    price: number,
    weight: number | null
}
