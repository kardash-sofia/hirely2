import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { Roles } from '../../user/constants';

export class RegisterDto {
  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsString()
  @IsEnum(Roles)
  role: Roles;

  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(16)
  @MinLength(8)
  password: string;
}
