import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        roles: any[];
        permissions: any[];
        id: string;
        email: string;
        name: string;
    }[]>;
    create(dto: CreateUserDto): Promise<{
        roles: any[];
        permissions: any[];
        id: string;
        email: string;
        name: string;
    }>;
    assignRoles(id: string, dto: AssignRolesDto): Promise<{
        roles: any[];
        permissions: any[];
        id: string;
        email: string;
        name: string;
    }>;
}
