import { Permission } from '../permissions/permission.entity';
import { User } from '../users/user.entity';
export declare class Role {
    id: string;
    name: string;
    permissions: Permission[];
    users: User[];
}
