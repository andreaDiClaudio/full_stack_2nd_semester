import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import * as dotenv from 'dotenv';
import { PassportStrategy } from '@nestjs/passport';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // Ensure this matches the secret you use to sign the token
    });
  }

  async validate(payload: any) {
    console.log("🔹 Token payload received in JwtStrategy:", payload); // Log the token payload
    return { id: payload.id, username: payload.username }; // Map the payload to the user object
  }
}
