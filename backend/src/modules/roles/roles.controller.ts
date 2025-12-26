import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('admin')
  @Permissions('roles.read')
  findAll() {
    return this.rolesService.findAll().then(roles =>
      roles.map(role => ({ id: role.id, name: role.name, permissions: role.permissions?.map(p => p.name) || [] }))
    );
  }

  @Post()
  @Roles('admin')
  @Permissions('roles.create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto).then(role => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions?.map(p => p.name) || []
    }));
  }
}
