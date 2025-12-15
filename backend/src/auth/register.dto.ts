import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsEmail({}, { message: "El formato del correo electrónico no es válido" })
  email: string;

  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
  })
  password: string;
}
