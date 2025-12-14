import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "src/users/user.service";
import { User } from "src/users/user.entity";
import { RegisterUserDto } from "./register.dto";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { LoginUserDto } from "./login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // Función para registrar un nuevo usuario
  async register(registerData: RegisterUserDto): Promise<any> {
    if (!registerData.password) {
      console.error("Password is required");
      throw new BadRequestException("Password is required");
    }

    const existingUser = await this.userService.findByEmail(registerData.email);
    if (existingUser) {
      console.error("Email already exists");
      throw new BadRequestException("Email already exists");
    }

    const user = new User();
    user.username = registerData.username;
    user.email = registerData.email;

    const saltRounds = Number(
      this.configService.get<string>("SALT_ROUNDS") || 10,
    );
    if (!saltRounds) {
      console.error("SALT_ROUNDS environment variable is not defined:");
      throw new BadRequestException(
        "SALT_ROUNDS environment variable is not defined",
      );
    }

    const validPassword = (user.password = await bcrypt.hash(
      registerData.password,
      saltRounds,
    ));
    if (!validPassword) {
      console.error("Error hashing password");
      throw new BadRequestException("Failed to hash password");
    }

    const newUser = {
      username: user.username,
      fullName: user.username,
      email: user.email,
      password: user.password,
      roleId: 2, // Asignar rol de estudiante por defecto
      createdAt: new Date(),
    };
    return this.userService.createUser(newUser);
  }

  // Función para login
  async login(loginData: LoginUserDto): Promise<any> {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    const payload = {
      sub: user.documentId,
      email: user.email,
      role: user.roleId.name,
    };
    try {
      const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });
      // Guardar el refreshToken en la base de datos
      user.refreshToken = refreshToken;
      await this.userService.saveUser(user);
      return {
        accessToken,
        refreshToken,
        role: payload.role,
        documentId: user.documentId,
      };
    } catch (error) {
      throw new UnauthorizedException("Error generando token");
    }
  }

  //Funcion para logout seguro (revoca refresh token)
  async logout(req): Promise<any> {
    try {
      const user = req.user;
      if (!user || !user.email) {
        throw new UnauthorizedException("Usuario no autenticado");
      }
      const dbUser = await this.userService.findByEmail(user.email);
      if (dbUser) {
        dbUser.refreshToken = null;
        await this.userService.saveUser(dbUser);
      }
      return { message: "Logout successful" };
    } catch (error) {
      console.error('Error during logout:', error.message);
      return { error: error.message };
    }
  }

  // Permitir buscar usuario por email desde el controlador
  async findUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }
}
