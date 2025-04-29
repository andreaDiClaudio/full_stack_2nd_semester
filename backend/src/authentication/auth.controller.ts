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
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';  // Import Swagger decorators
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication')  // Group all auth-related endpoints under this tag
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade user privileges' })  // Operation description
  @ApiResponse({ status: 200, description: 'User upgraded successfully' })  // Successful response
  @ApiResponse({ status: 500, description: 'Failed to upgrade user' })  // Failure response
  async upgrade(@Request2() req) {
    try {
      const result = await this.authService.upgrade(req.user.username);
      return { message: 'User upgraded successfully', result };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upgrade user');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: Object })  // Return token info in response
  @ApiResponse({ status: 401, description: 'Invalid credentials' })  // Invalid credentials response
  async login(@Request2() req) {
    try {
      const token = await this.authService.login(req.body.username, req.body.password);
      return { message: 'Login successful', ...token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({ 
    description: 'User signup credentials', 
    type: Object, 
    schema: {
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'password123' }
      }
    }
  })  // Document the body parameters for signup
  @ApiResponse({ status: 200, description: 'User registered successfully', type: Object })
  @ApiResponse({ status: 400, description: 'Username and password are required' })  // Bad request for missing username/password
  @ApiResponse({ status: 500, description: 'Failed to register user' })  // Internal server error on failure
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
