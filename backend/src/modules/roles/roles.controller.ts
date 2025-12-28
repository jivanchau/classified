import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
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

  @Get(':id')
  @Roles('admin')
  @Permissions('roles.read')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id).then(role => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions?.map(p => p.name) || []
    }));
  }

  @Patch(':id')
  @Roles('admin')
  @Permissions('roles.update')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto).then(role => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions?.map(p => p.name) || []
    }));
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('roles.delete')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id).then(role => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions?.map(p => p.name) || []
    }));
  }
}
