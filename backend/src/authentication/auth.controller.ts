import {
    Controller,
    Post,
    UseGuards,
    Request as Request2,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.gurd';
  
  @Controller()
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post('auth/upgrade')
    upgrade(@Request2() req) {
        return this.authService.upgrade(req.user.id)
    }
  
  
    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request2() req) {
      return this.authService.login(req.user);
    }
    
    @Post('auth/signup')
    async signup(@Request2() req) {
      // console.log("body", req.body);
      
      return this.authService.signup(req.body);
    }
  }