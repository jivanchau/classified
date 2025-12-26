import { Role } from '../roles/role.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    roles: Role[];
}
