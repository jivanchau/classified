import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './permission.entity';
export declare class PermissionsService {
    private permissionsRepo;
    constructor(permissionsRepo: Repository<Permission>);
    findAll(): Promise<Permission[]>;
    create(dto: CreatePermissionDto): Promise<Permission>;
}
