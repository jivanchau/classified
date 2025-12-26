import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AssignRolesDto } from './dto/assign-roles.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @Permissions('users.read')
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(u => this.usersService.toSafeUser(u));
  }

  @Post()
  @Roles('admin')
  @Permissions('users.create')
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.usersService.toSafeUser(user);
  }

  @Patch(':id/roles')
  @Roles('admin')
  @Permissions('users.assignRoles')
  async assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto) {
    const user = await this.usersService.assignRoles(id, dto.roles);
    return this.usersService.toSafeUser(user);
  }
}
