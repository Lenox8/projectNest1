import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signupdto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SigninDto): Promise<{ access_token: string }> {
    const { email, pass } = signInDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const password = await bcrypt.compare(pass, user.pass);
    if (!password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignupDto): Promise<object> {
    const exists = await this.usersService.findByEmail(signUpDto?.email);
    if (exists) {
      throw new HttpException('User already exists', 409);
    }
    const h = await bcrypt.hash(signUpDto.pass, 10);
    const newuser = await this.usersService.create({
      ...signUpDto,
      pass: h,
    });
    return newuser;
  }
}
