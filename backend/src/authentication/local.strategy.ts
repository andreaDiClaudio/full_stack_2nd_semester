
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    
    const user = await this.authService.validateUser(username, password);
    console.log("user in local.strategy", user);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}