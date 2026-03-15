import { Role } from '../user.model';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  pass!: string;

  @IsNotEmpty()
  birthYear!: Date;

  role!: Role;
}
