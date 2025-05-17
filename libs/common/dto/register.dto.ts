import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from '../interfaces/role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
