import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async upgrade(username: string) {
    console.log("Reached");
    
    const userFound = await this.usersService.findOne(username);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    console.log("userFound", userFound);
    
    return this.usersService.upgrade(userFound.id);
  }

  async signup(username: string, password: string) {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    return this.usersService.create(username, password);
  }

  async login(user: any, password: string) {
    const userFromDb = await this.usersService.findOne(user.username);
    if (!userFromDb || userFromDb.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }
  
    const payload = { username: user.username, id: userFromDb.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const isPasswordValid = user.password === pass; // Replace with hashed password check if needed
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const { password, ...result } = user;
    return result;
  }
}