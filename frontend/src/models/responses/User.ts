export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole; // предполагая возможные роли
}

export enum UserRole {
    Client = 'client',
    Admin = 'admin',
    Confectioner = 'confectioner'
}
