import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {

    return super.canActivate(context); // Delegate to the default canActivate logic
  }

  handleRequest(err, user, info) {
    console.log("Checking jwt...");
    
    if (err || !user) {
      console.log("JWT error or user not found:", err); // Log if there's an error
      throw err || new UnauthorizedException('Unauthorized access');
    } else {
      return user;
    }
  }
}
