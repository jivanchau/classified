import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        roles: string[];
        permissions: string[];
        id: string;
        email: string;
        name: string;
    }[]>;
    create(dto: CreateUserDto): Promise<{
        roles: string[];
        permissions: string[];
        id: string;
        email: string;
        name: string;
    }>;
    assignRoles(id: string, dto: AssignRolesDto): Promise<{
        roles: string[];
        permissions: string[];
        id: string;
        email: string;
        name: string;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        roles: string[];
        permissions: string[];
        id: string;
        email: string;
        name: string;
    }>;
    remove(id: string): Promise<{
        roles: string[];
        permissions: string[];
        id: string;
        email: string;
        name: string;
    }>;
}
