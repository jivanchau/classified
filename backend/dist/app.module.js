"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const categories_module_1 = require("./modules/categories/categories.module");
const user_entity_1 = require("./modules/users/user.entity");
const role_entity_1 = require("./modules/roles/role.entity");
const permission_entity_1 = require("./modules/permissions/permission.entity");
const category_entity_1 = require("./modules/categories/category.entity");
const media_entity_1 = require("./modules/media/media.entity");
const media_module_1 = require("./modules/media/media.module");
const seed_service_1 = require("./seed/seed.service");
const cities_module_1 = require("./modules/cities/cities.module");
const city_entity_1 = require("./modules/cities/city.entity");
const location_entity_1 = require("./modules/cities/location.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                synchronize: true,
                entities: [user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission, category_entity_1.Category, media_entity_1.Media, city_entity_1.City, location_entity_1.Location]
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission, category_entity_1.Category, media_entity_1.Media, city_entity_1.City, location_entity_1.Location]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            categories_module_1.CategoriesModule,
            media_module_1.MediaModule,
            cities_module_1.CitiesModule
        ],
        providers: [seed_service_1.SeedService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map