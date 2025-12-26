import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): Promise<import("./permission.entity").Permission[]>;
    create(dto: CreatePermissionDto): Promise<import("./permission.entity").Permission>;
}
