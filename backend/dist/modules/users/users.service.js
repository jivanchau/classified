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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
const role_entity_1 = require("../roles/role.entity");
let UsersService = class UsersService {
    constructor(usersRepo, rolesRepo) {
        this.usersRepo = usersRepo;
        this.rolesRepo = rolesRepo;
    }
    async findAll() {
        return this.usersRepo.find({ relations: ['roles', 'roles.permissions'] });
    }
    async findByEmail(email) {
        return this.usersRepo.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });
    }
    async findById(id) {
        return this.usersRepo.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
    }
    async create(dto) {
        var _a;
        const password = await bcrypt.hash(dto.password, 10);
        let roles = [];
        if ((_a = dto.roles) === null || _a === void 0 ? void 0 : _a.length) {
            roles = await this.rolesRepo.find({ where: { name: (0, typeorm_2.In)(dto.roles) }, relations: ['permissions'] });
        }
        const user = this.usersRepo.create({
            name: dto.name,
            email: dto.email,
            password,
            roles
        });
        return this.usersRepo.save(user);
    }
    async assignRoles(userId, roles) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const roleEntities = await this.rolesRepo.find({ where: { name: (0, typeorm_2.In)(roles) }, relations: ['permissions'] });
        user.roles = roleEntities;
        return this.usersRepo.save(user);
    }
    async update(id, dto) {
        const user = await this.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.name !== undefined) {
            user.name = dto.name;
        }
        if (dto.email !== undefined) {
            user.email = dto.email;
        }
        if (dto.password) {
            user.password = await bcrypt.hash(dto.password, 10);
        }
        if (dto.roles !== undefined) {
            const roleEntities = dto.roles.length
                ? await this.rolesRepo.find({ where: { name: (0, typeorm_2.In)(dto.roles) }, relations: ['permissions'] })
                : [];
            user.roles = roleEntities;
        }
        return this.usersRepo.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.usersRepo.remove(user);
        return user;
    }
    toSafeUser(user) {
        var _a, _b;
        const { password } = user, rest = __rest(user, ["password"]);
        const roles = ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.map(r => r.name)) || [];
        const permissions = ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.flatMap(r => { var _a; return ((_a = r.permissions) === null || _a === void 0 ? void 0 : _a.map(p => p.name)) || []; })) || [];
        return Object.assign(Object.assign({}, rest), { roles, permissions });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map