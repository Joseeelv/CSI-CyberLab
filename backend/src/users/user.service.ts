import {
  ConflictException,
  NotFoundException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { Role } from "src/role/role.entity";
import { RegisterUserDto } from "../auth/register.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "./user.dto";
import { UserBasicDto } from "./basicUserDto.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  // Inyectar el repositorio de usuarios
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService, // <-- Agrega esto
  ) {}

  // Crear un nuevo usuario
  async createUser(userDto: RegisterUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(userDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException("Error creating user");
    }
  }

  // Buscar un usuario por su correo electrónico
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["roleId"], // Incluir la relación del rol
    });
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ["roleId"], // Incluir la relación del rol
    });
  }

  async findByDocumentId(
    documentId: string,
  ): Promise<UserBasicDto | null | string> {
    try {
      const user = await this.userRepository.findOne({
        where: { documentId },
        relations: ["roleId"], // Incluir la relación del rol
      });
      if (!user) return null;
      // Devuelve solo los campos deseados
      return {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        documentId: user.documentId,
      };
    } catch (error) {
      console.error("Error in findByDocumentId:", error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ["roleId", "containers"],
    });
  }

  //Obtener el conteo de usuarios (estudiantes)
  async countUsers(): Promise<number> {
    return await this.userRepository.count({ where: { roleId: { id: 2 } } });
  }

  // Actualizar un usuario por su ID
  async updateUser(documentId: string, updateData: UserDto): Promise<any> {
    // Buscar el usuario por ID
    const user = await this.userRepository.findOne({ where: { documentId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Validar y asignar el rol si se proporciona
    if (updateData.roleId) {
      const roleId = Number(updateData.roleId);
      if (isNaN(roleId)) {
        throw new ConflictException("Invalid roleId");
      }

      const roleEntity = await this.roleRepository.findOne({
        where: { id: roleId },
      });
      if (!roleEntity) {
        throw new NotFoundException("Role not found");
      }
      user.roleId = roleEntity; // Asignar el rol al usuario
    }

    // Validar el correo electrónico si se proporciona
    if (updateData.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email },
      });
      if (existingUser && existingUser.documentId !== documentId) {
        throw new ConflictException("Email already in use");
      }
      user.email = updateData.email; // Actualizar el correo
    }

    // Actualizar otros campos
    if (updateData.fullName) user.fullName = updateData.fullName;
    if (updateData.username) user.username = updateData.username;
    if (updateData.password) user.password = updateData.password;

    // Guardar los cambios
    await this.userRepository.save(user);

    // Recargar el usuario con la relación de rol
    const updatedUser = await this.userRepository.findOne({
      where: { documentId: user.documentId },
      relations: ["roleId"],
    });

    if (!updatedUser) {
      throw new NotFoundException("User not found after update");
    }

    const payload = {
      id: updatedUser.documentId,
      email: updatedUser.email,
      role: updatedUser.roleId?.name ?? null,
    };
    try {
      const accessToken = this.jwtService.sign(payload);
      return {
        accessToken,
        role: payload.role,
        documentId: updatedUser.documentId,
      };
    } catch (error) {
      console.error("Error generando JWT:", error);
      throw new UnauthorizedException("Error generando token");
    }
  }

  // Eliminar un usuario por su ID
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    //Tengo que eliminar las flag submissions asociadas al usuario primero por la FK
    await this.userRepository.manager
      .createQueryBuilder()
      .delete()
      .from("flag_submission")
      .where("userId = :id", { id })
      .execute();

    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
  }

  // Guardar usuario (para refresh token)
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
