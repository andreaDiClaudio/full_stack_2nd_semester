import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Role } from '../users/role';

@Injectable()
export class PremiumUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user?.role; // Ensure user is defined
    
    // Log the role and other useful information for debugging purposes
    console.log(`Checking role for user ${user?.username}: Role = ${userRole}`);
    console.log(`Requested route: ${request.url}`);
    
    if (!user) {
      // If no user is found in the request, log the issue and throw an error
      console.log('No user found in the request.');
      throw new ForbiddenException('Access denied: No user found');
    }

    // If the role is not PremiumUser or Admin, throw an exception with a specific message
    if (userRole !== Role.PremiumUser && userRole !== Role.Admin) {
      console.log(`Access denied for user ${user?.username}. Role ${userRole} is not allowed.`);
      throw new ForbiddenException('Access denied: You must be a PremiumUser or Admin to access this resource');
    }

    console.log(`Access granted for user ${user?.username} with role ${userRole}.`);
    return true; // User has valid role, access is granted
  }
}
