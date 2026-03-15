import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import type { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('all')
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    if (!users) {
      throw new NotFoundException('Users not found in the database');
    }

    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    return user;
  }

  @Post('new')
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
