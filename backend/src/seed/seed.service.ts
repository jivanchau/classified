import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';
import { Permission } from '../modules/permissions/permission.entity';
import { Role } from '../modules/roles/role.entity';
import { User } from '../modules/users/user.entity';

const DEFAULT_PERMISSIONS: { name: string; description: string }[] = [
  { name: 'users.read', description: 'Read users' },
  { name: 'users.create', description: 'Create users' },
  { name: 'users.assignRoles', description: 'Assign roles to users' },
  { name: 'roles.read', description: 'Read roles' },
  { name: 'roles.create', description: 'Create roles' },
  { name: 'roles.update', description: 'Update roles' },
  { name: 'roles.delete', description: 'Delete roles' },
  { name: 'permissions.read', description: 'Read permissions' },
  { name: 'permissions.create', description: 'Create permissions' }
];

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Permission) private readonly permissionsRepo: Repository<Permission>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService
  ) {}

  async seedAdmin() {
    const permissions = await this.ensurePermissions();
    const adminRole = await this.ensureAdminRole(permissions);
    await this.ensureAdminUser(adminRole);
  }

  private async ensurePermissions() {
    const names = DEFAULT_PERMISSIONS.map(p => p.name);
    const existing = await this.permissionsRepo.find({ where: { name: In(names) } });
    const existingMap = new Map(existing.map(p => [p.name, p]));
    const permissions: Permission[] = [];

    for (const perm of DEFAULT_PERMISSIONS) {
      let entity = existingMap.get(perm.name);
      if (!entity) {
        entity = this.permissionsRepo.create(perm);
        entity = await this.permissionsRepo.save(entity);
        this.logger.log(`Created permission ${perm.name}`);
      }
      permissions.push(entity);
    }

    return permissions;
  }

  private async ensureAdminRole(permissions: Permission[]) {
    let role = await this.rolesRepo.findOne({ where: { name: 'admin' }, relations: ['permissions'] });
    if (!role) {
      role = this.rolesRepo.create({ name: 'admin', permissions });
      role = await this.rolesRepo.save(role);
      this.logger.log('Created admin role');
      return role;
    }

    const existingNames = new Set(role.permissions?.map(p => p.name) || []);
    const missing = permissions.filter(p => !existingNames.has(p.name));
    if (missing.length) {
      role.permissions = [...(role.permissions || []), ...missing];
      role = await this.rolesRepo.save(role);
      this.logger.log(`Updated admin role with permissions: ${missing.map(m => m.name).join(', ')}`);
    }
    return role;
  }

  private async ensureAdminUser(adminRole: Role) {
    const email = this.config.get<string>('ADMIN_EMAIL') || 'admin@classified.local';
    const password = this.config.get<string>('ADMIN_PASSWORD') || 'admin123';
    const name = this.config.get<string>('ADMIN_NAME') || 'Admin';

    let user = await this.usersRepo.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = this.usersRepo.create({ email, name, password: hashed, roles: [adminRole] });
      await this.usersRepo.save(user);
      this.logger.log(`Created admin user ${email}`);
      return;
    }

    const hasAdminRole = user.roles?.some(role => role.name === adminRole.name);
    if (!hasAdminRole) {
      user.roles = [...(user.roles || []), adminRole];
      await this.usersRepo.save(user);
      this.logger.log(`Assigned admin role to ${email}`);
    }
  }
}
