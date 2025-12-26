import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const safeUser = this.usersService.toSafeUser(user);
    const payload = { sub: user.id, email: user.email, roles: safeUser.roles, permissions: safeUser.permissions };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: safeUser
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const safeUser = this.usersService.toSafeUser(user);
    const payload = { sub: user.id, email: user.email, roles: safeUser.roles, permissions: safeUser.permissions };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: safeUser
    };
  }
}
