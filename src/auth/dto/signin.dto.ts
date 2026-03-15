import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  pass!: string;
}
