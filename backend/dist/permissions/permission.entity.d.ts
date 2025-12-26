import { Role } from '../roles/role.entity';
export declare class Permission {
    id: string;
    name: string;
    description?: string;
    roles: Role[];
}
