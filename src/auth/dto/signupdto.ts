import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../users/user.model';

export class SignupDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  pass!: string;

  @IsNotEmpty()
  birthYear!: Date;

  role!: Role;
}
