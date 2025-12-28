import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';
export declare class RolesService {
    private rolesRepo;
    private permissionsRepo;
    constructor(rolesRepo: Repository<Role>, permissionsRepo: Repository<Permission>);
    findAll(): Promise<Role[]>;
    create(dto: CreateRoleDto): Promise<Role>;
    findOne(id: string): Promise<Role>;
    update(id: string, dto: UpdateRoleDto): Promise<Role>;
    remove(id: string): Promise<Role>;
}
