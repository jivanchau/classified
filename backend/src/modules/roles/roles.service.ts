import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
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
}
