import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Permission, permission => permission.roles, { cascade: true })
  @JoinTable({ name: 'role_permissions' })
  permissions!: Permission[];

  @ManyToMany(() => User, user => user.roles)
  users!: User[];
}
