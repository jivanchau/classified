import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionsRepo: Repository<Permission>
  ) {}

  async findAll() {
    return this.rolesRepo.find({ relations: ['permissions'] });
  }

  async create(dto: CreateRoleDto) {
    const permissions = dto.permissions?.length
      ? await this.permissionsRepo.find({ where: { name: In(dto.permissions) } })
      : [];
    const role = this.rolesRepo.create({ name: dto.name, permissions });
    return this.rolesRepo.save(role);
  }

  async findOne(id: string) {
    const role = await this.rolesRepo.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (dto.name !== undefined) {
      role.name = dto.name;
    }

    if (dto.permissions !== undefined) {
      const permissions = dto.permissions.length
        ? await this.permissionsRepo.find({ where: { name: In(dto.permissions) } })
        : [];
      role.permissions = permissions;
    }

    return this.rolesRepo.save(role);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    return this.rolesRepo.remove(role);
  }
}
