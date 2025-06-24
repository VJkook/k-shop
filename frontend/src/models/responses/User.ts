export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole; // предполагая возможные роли
}

export interface Confectioner {
    id: number;
    name: string;
    email: string;
    busy_time: string;
}

export enum UserRole {
    Client = 'client',
    Admin = 'admin',
    Confectioner = 'confectioner'
}