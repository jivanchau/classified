import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
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
}
