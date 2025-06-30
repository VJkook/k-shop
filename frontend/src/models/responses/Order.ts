import {OrderOrBasketItem} from "./OrderOrBasketItemsResponse";
import {Confectioner, User} from "./User";

export interface Order {
    id: number
    total_cost: number
    registration_date: string
    delivery_date: string
    work_date: string | null
    work_time: string | null
    completed_date: string | null
    delivery_address: string
    status: OrderStatus
    payment_status: string
    products: OrderOrBasketItem[]
    weight: number | null
    confectioner: Confectioner | null
    client: User
}

export interface OrderStatus {
    id: number
    name: string
    color: string
}
