import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
