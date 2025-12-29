import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>
  ) {}

  async findAll() {
    return this.usersRepo.find({ relations: ['roles', 'roles.permissions'] });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
  }

  async create(dto: CreateUserDto) {
    const password = await bcrypt.hash(dto.password, 10);
    let roles: Role[] = [];
    if (dto.roles?.length) {
      roles = await this.rolesRepo.find({ where: { name: In(dto.roles) }, relations: ['permissions'] });
    }
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      password,
      roles
    });
    return this.usersRepo.save(user);
  }

  async assignRoles(userId: string, roles: string[]) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const roleEntities = await this.rolesRepo.find({ where: { name: In(roles) }, relations: ['permissions'] });
    user.roles = roleEntities;
    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

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
        ? await this.rolesRepo.find({ where: { name: In(dto.roles) }, relations: ['permissions'] })
        : [];
      user.roles = roleEntities;
    }

    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.remove(user);
    return user;
  }

  toSafeUser(user: User) {
    const { password, ...rest } = user;
    const roles = user.roles?.map(r => r.name) || [];
    const permissions = user.roles?.flatMap(r => r.permissions?.map(p => p.name) || []) || [];
    return { ...rest, roles, permissions };
  }
}
