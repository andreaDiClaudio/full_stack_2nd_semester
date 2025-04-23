import {
  Controller,
  Post,
  UseGuards,
  Request as Request2,
  Body,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { PremiumUserGuard } from './premium-user.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  async upgrade(@Request2() req) {
    try {
      console.log(req.user);
      
      const result = await this.authService.upgrade(req.user.username);
      return { message: 'User upgraded successfully', result };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upgrade user');
    }
  }

  @Post('login')
  async login(@Request2() req) {
    try {
      const token = await this.authService.login(req.user, req.body.password);
      return { message: 'Login successful', ...token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('signup')
  async signup(@Body() body) {
    console.log("Accessed signup endpoint");
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    try {
      const user = await this.authService.signup(username, password);
      console.log("User registered successfully!");
      return { message: 'User registered successfully', user };
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

}