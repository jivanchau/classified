import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/role.entity';
export declare class UsersService {
    private usersRepo;
    private rolesRepo;
    constructor(usersRepo: Repository<User>, rolesRepo: Repository<Role>);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    assignRoles(userId: string, roles: string[]): Promise<User>;
    toSafeUser(user: User): {
        roles: string[];
        permissions: string[];
        id: string;
        email: string;
        name: string;
    };
}
