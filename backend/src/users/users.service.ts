import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './../authentication/entities/user';
import { Role } from './role';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async upgrade(userId: number): Promise<UserEntity> {
    console.log(userId);
    
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    console.log("upgading user role...");
    
    user.role = Role.PremiumUser;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to upgrade user role.');
    }
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async findOne(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found.`);
    }
    return user;
  }

  async create(username: string, password: string): Promise<UserEntity> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { username } });
      if (existingUser) {
        throw new ConflictException('Username is already taken.');
      }

      const newUser = this.userRepository.create({ username, password });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
}