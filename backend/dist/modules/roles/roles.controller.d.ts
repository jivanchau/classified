import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<{
        id: string;
        name: string;
        permissions: string[];
    }[]>;
    create(dto: CreateRoleDto): Promise<{
        id: string;
        name: string;
        permissions: string[];
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        permissions: string[];
    }>;
    update(id: string, dto: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        permissions: string[];
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        permissions: string[];
    }>;
}
