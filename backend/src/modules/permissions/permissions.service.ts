import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private permissionsRepo: Repository<Permission>) {}

  findAll() {
    return this.permissionsRepo.find();
  }

  create(dto: CreatePermissionDto) {
    const permission = this.permissionsRepo.create(dto);
    return this.permissionsRepo.save(permission);
  }
}
