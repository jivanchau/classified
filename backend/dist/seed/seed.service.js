"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../modules/permissions/permission.entity");
const role_entity_1 = require("../modules/roles/role.entity");
const user_entity_1 = require("../modules/users/user.entity");
const DEFAULT_PERMISSIONS = [
    { name: 'users.read', description: 'Read users' },
    { name: 'users.create', description: 'Create users' },
    { name: 'users.assignRoles', description: 'Assign roles to users' },
    { name: 'users.update', description: 'Update users' },
    { name: 'users.delete', description: 'Delete users' },
    { name: 'roles.read', description: 'Read roles' },
    { name: 'roles.create', description: 'Create roles' },
    { name: 'roles.update', description: 'Update roles' },
    { name: 'roles.delete', description: 'Delete roles' },
    { name: 'permissions.read', description: 'Read permissions' },
    { name: 'permissions.create', description: 'Create permissions' }
];
let SeedService = SeedService_1 = class SeedService {
    constructor(permissionsRepo, rolesRepo, usersRepo, config) {
        this.permissionsRepo = permissionsRepo;
        this.rolesRepo = rolesRepo;
        this.usersRepo = usersRepo;
        this.config = config;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async seedAdmin() {
        const permissions = await this.ensurePermissions();
        const adminRole = await this.ensureAdminRole(permissions);
        await this.ensureAdminUser(adminRole);
    }
    async ensurePermissions() {
        const names = DEFAULT_PERMISSIONS.map(p => p.name);
        const existing = await this.permissionsRepo.find({ where: { name: (0, typeorm_2.In)(names) } });
        const existingMap = new Map(existing.map(p => [p.name, p]));
        const permissions = [];
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
    async ensureAdminRole(permissions) {
        var _a;
        let role = await this.rolesRepo.findOne({ where: { name: 'admin' }, relations: ['permissions'] });
        if (!role) {
            role = this.rolesRepo.create({ name: 'admin', permissions });
            role = await this.rolesRepo.save(role);
            this.logger.log('Created admin role');
            return role;
        }
        const existingNames = new Set(((_a = role.permissions) === null || _a === void 0 ? void 0 : _a.map(p => p.name)) || []);
        const missing = permissions.filter(p => !existingNames.has(p.name));
        if (missing.length) {
            role.permissions = [...(role.permissions || []), ...missing];
            role = await this.rolesRepo.save(role);
            this.logger.log(`Updated admin role with permissions: ${missing.map(m => m.name).join(', ')}`);
        }
        return role;
    }
    async ensureAdminUser(adminRole) {
        var _a;
        const email = this.config.get('ADMIN_EMAIL') || 'admin@classified.local';
        const password = this.config.get('ADMIN_PASSWORD') || 'admin123';
        const name = this.config.get('ADMIN_NAME') || 'Admin';
        let user = await this.usersRepo.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });
        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            user = this.usersRepo.create({ email, name, password: hashed, roles: [adminRole] });
            await this.usersRepo.save(user);
            this.logger.log(`Created admin user ${email}`);
            return;
        }
        const hasAdminRole = (_a = user.roles) === null || _a === void 0 ? void 0 : _a.some(role => role.name === adminRole.name);
        if (!hasAdminRole) {
            user.roles = [...(user.roles || []), adminRole];
            await this.usersRepo.save(user);
            this.logger.log(`Assigned admin role to ${email}`);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], SeedService);
//# sourceMappingURL=seed.service.js.map