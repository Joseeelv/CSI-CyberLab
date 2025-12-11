import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import { RegisterUserDto } from './register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly roleService: RoleService,
  ) { }

  async register(registerData: RegisterUserDto): Promise<any> {
    // Validar que la contraseña existe
    if (!registerData.password) {
      throw new BadRequestException('Password is required');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userService.findByEmail(registerData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Obtener salt rounds de configuración
    const saltRounds = parseInt(
      this.configService.get<string>('SALT_ROUNDS', '10'),
      10,
    );

    // Hashear la contraseña
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(registerData.password, saltRounds);
    } catch (error) {
      throw new InternalServerErrorException('Failed to process password');
    }

    // Obtener el rol por defecto (user)
    const defaultRole = await this.roleService.findRoleById(2);
    if (!defaultRole) {
      throw new InternalServerErrorException('Default role not found. Please contact administrator.');
    }

    // Crear nuevo usuario
    const newUser = {
      username: registerData.username,
      fullName: registerData.username,
      email: registerData.email,
      password: hashedPassword,
      role: defaultRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await this.userService.createUser(newUser);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async login(email: string, password: string, userAgent: string): Promise<any> {
    // Buscar usuario
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Obtener rol del usuario
    const userRole = await this.getUserRole(user);

    // Crear payload y token
    const payload = {
      sub: user.id, // Es buena práctica incluir el ID del usuario
      name: user.username,
      email: user.email,
      role: userRole,
    };

    const accessToken = this.jwtService.sign(payload);

    // Crear sesión
    const newSession = {
      token: accessToken,
      userAgent: userAgent,
      user: user,
      startTime: new Date(),
    };

    try {
      await this.sessionService.createSession(newSession);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create session');
    }

    return {
      accessToken,
      role: userRole,
    };
  }

  async logout(token: string): Promise<void> {
    try {
      // Verificar y decodificar el token
      const payload = this.jwtService.verify(token);

      // Eliminar la sesión
      await this.sessionService.deleteSessionByToken(token);
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new InternalServerErrorException('Failed to logout');
    }
  }


  private async getUserRole(user: User): Promise<any> {
    if (typeof user.role === 'object' && user.role !== null) {
      return user.role;
    }

    // Si es un número (ID), buscar el rol
    if (typeof user.role === 'number') {
      const role = await this.roleService.getRoleById(user.role);
      if (!role) {
        throw new InternalServerErrorException('User role not found');
      }
      return role;
    }

    throw new InternalServerErrorException('User role is not properly configured');
  }
}