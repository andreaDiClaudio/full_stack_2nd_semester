import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Role } from '../users/role'
import { UsersService } from 'src/users/users.service';

//Used with JWT guard to allow only admin access to endpoint.
@Injectable()
export class PremiumUserGuard implements CanActivate {
  constructor(@Inject(UsersService) private usersService: UsersService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userId: number = request.user.id

    const user = await this.usersService.findUserById(userId);

    return user && user.role === Role.PremiumUser || user.role === Role.Admin
  }
}