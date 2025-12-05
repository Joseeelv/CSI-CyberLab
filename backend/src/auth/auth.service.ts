import { Injectable, UnauthorizedException, BadRequestException, Req } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import { RegisterUserDto } from './register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { LoginUserDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  // Función para registrar un nuevo usuario
  async register(registerData: RegisterUserDto): Promise<any> {
    if (!registerData.password) {
      console.log('Password is required', error);
      throw new BadRequestException('Password is required');
    }

    const existingUser = await this.userService.findByEmail(registerData.email);
    if (existingUser) {
      console.log('Email already exists');
      throw new BadRequestException('Email already exists');
    }

    const user = new User();
    user.username = registerData.username;
    user.email = registerData.email;

    const saltRounds = Number(this.configService.get<string>('SALT_ROUNDS'));
    if (!saltRounds) {
      console.error('SALT_ROUNDS environment variable is not defined:');
      throw new BadRequestException('SALT_ROUNDS environment variable is not defined');
    }

    const validPassword = user.password = await bcrypt.hash(registerData.password, saltRounds);
    if (!validPassword) {
      console.error('Error hashing password:', error);
      throw new BadRequestException('Failed to hash password');
    }

    const newUser = {
      username: user.username,
      fullName: user.username,
      email: user.email,
      password: user.password,
      isPremium: false,
      role: 'student', // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.userService.createUser(newUser);
  }

  // Función para login
  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Avoid leaking whether the user exists
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Build a minimal payload (do not include sensitive data)
    const payload = { name: user.username, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, role: user.role };
  }

  //Funcion para logout
  async logout(@Req() req): Promise<any> {
    //Implementar la lógica de cierre de sesión
    try {
      // Lógica para eliminar la cookie de sesión
      req.res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return { message: 'Logout successful' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
