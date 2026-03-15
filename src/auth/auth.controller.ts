import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signupdto';
import { AuthGuard } from './guard/jwt-auth/auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './guard/roles/roles.guard';

interface RequestWithUser extends Express.Request {
  user?: {
    userId: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SigninDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Roles('user', 'admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('admin')
  getAdminInfo() {
    return 'This is admin route';
  }
}
