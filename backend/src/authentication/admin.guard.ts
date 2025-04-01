import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Role } from './../users/role'
import { UserEntity } from './entities/user'
import { UsersService } from 'src/users/users.service'

//Used with JWT guard to allow only admin access to endpoint.
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(UsersService) private usersService: UsersService) {}
  
  async canActivate(context: ExecutionContext) : Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userId: number = request.user.id

    const user = await this.usersService.findUserById(userId);

    console.log("user in admin guard", user);

    // This returns true if there is a user and the user is an admin
    return user && user.role === Role.Admin
  }
}