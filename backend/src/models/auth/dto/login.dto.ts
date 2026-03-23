import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(16)
  @MinLength(8)
  password: string;
}
