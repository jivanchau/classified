import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { User } from './modules/users/user.entity';
import { Role } from './modules/roles/role.entity';
import { Permission } from './modules/permissions/permission.entity';
import { Category } from './modules/categories/category.entity';
import { Media } from './modules/media/media.entity';
import { MediaModule } from './modules/media/media.module';
import { SeedService } from './seed/seed.service';
import { CitiesModule } from './modules/cities/cities.module';
import { City } from './modules/cities/city.entity';
import { Location } from './modules/cities/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [User, Role, Permission, Category, Media, City, Location]
    }),
    TypeOrmModule.forFeature([User, Role, Permission, Category, Media, City, Location]),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    CategoriesModule,
    MediaModule,
    CitiesModule
  ],
  providers: [SeedService]
})
export class AppModule {}
