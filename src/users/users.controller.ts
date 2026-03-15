import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import type { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guard/jwt-auth/auth.guard';
import { RolesGuard } from '../auth/guard/roles/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    if (!users) {
      throw new NotFoundException('Users not found in the database');
    }

    return users;
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    return user;
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('new')
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
