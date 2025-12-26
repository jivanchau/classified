import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { User } from './modules/users/user.entity';
import { Role } from './modules/roles/role.entity';
import { Permission } from './modules/permissions/permission.entity';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [User, Role, Permission]
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule
  ],
  providers: [SeedService]
})
export class AppModule {}
