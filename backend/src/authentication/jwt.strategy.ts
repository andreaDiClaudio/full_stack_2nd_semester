import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import * as dotenv from 'dotenv';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/role';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // Ensure this matches the secret you use to sign the token
    });
  }

  async validate(payload: any) {
    // Retrieve user data from the database to attach the role (assuming it is not already in the payload)
    const user = await this.usersService.findUserById(payload.id);
  
    // Add role to the payload if not already present
    return {
      id: payload.id,
      username: payload.username,
      role: user?.role || Role.User,  // Default to Role.User if role is not found
    };
  }
}
