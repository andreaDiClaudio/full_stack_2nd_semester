import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {

    return super.canActivate(context); // Delegate to the default canActivate logic
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log("JWT error or user not found:", err, info); // Log if there's an error
      throw err || new UnauthorizedException('Unauthorized access');
    }
    console.log("Decoded user from JWT in JwtAuthGuard:", user); // Log the decoded user from JWT
    return user; // Return the decoded user
  }
}
