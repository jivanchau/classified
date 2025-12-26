import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<{
        id: string;
        email: string;
        name: string;
        roles: import("../modules/roles/role.entity").Role[];
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            roles: string[];
            permissions: string[];
            id: string;
            email: string;
            name: string;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            roles: string[];
            permissions: string[];
            id: string;
            email: string;
            name: string;
        };
    }>;
}
