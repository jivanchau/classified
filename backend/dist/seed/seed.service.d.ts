import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Permission } from '../modules/permissions/permission.entity';
import { Role } from '../modules/roles/role.entity';
import { User } from '../modules/users/user.entity';
export declare class SeedService {
    private readonly permissionsRepo;
    private readonly rolesRepo;
    private readonly usersRepo;
    private readonly config;
    private readonly logger;
    constructor(permissionsRepo: Repository<Permission>, rolesRepo: Repository<Role>, usersRepo: Repository<User>, config: ConfigService);
    seedAdmin(): Promise<void>;
    private ensurePermissions;
    private ensureAdminRole;
    private ensureAdminUser;
}
