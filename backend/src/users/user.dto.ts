import { IsEmail, IsString, MinLength, Matches, IsNumber, IsOptional } from 'class-validator';

export class UserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsOptional()
  email: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  @IsOptional()
  password: string;

  @IsNumber()
  @IsOptional()
  roleId: number;

  @IsString()
  @IsOptional()
  fullName: string;
}