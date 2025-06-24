import {Confectioner} from "./User";

export interface ConfectionerCalendar {
    dates: Array<{
        date: string;
        confectioners: Confectioner[];
    }>;
}