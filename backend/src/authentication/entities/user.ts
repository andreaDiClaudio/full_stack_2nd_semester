import { Role } from './../../users/role';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type:"enum", 
    enum: Role, 
    default: Role.User
  })
  role: Role;
}