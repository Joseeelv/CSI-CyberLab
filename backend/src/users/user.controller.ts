import { Controller, UseGuards } from "@nestjs/common";
import { Get, Param, Post, Body, Patch, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";
import { JwtService } from "@nestjs/jwt";
import { UserBasicDto } from "./basicUserDto.dto";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Endpoint para obtener todos los usuarios
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  //Endpoitn para obtener el número de estudiantes registrados
  @Get("count")
  async getCount() {
    const count = await this.userService.countUsers();
    return { count };
  }

  // Endpoint para actualizar un usuario por su ID
  @Patch(":documentId")
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param("documentId") documentId: string,
    @Body() updateData: UserDto,
  ): Promise<any> {
    const {
      accessToken,
      role,
      documentId: updatedDocumentId,
    } = await this.userService.updateUser(documentId, updateData);
    return {
      message: "Usuario actualizado",
      accessToken,
      role,
      documentId: updatedDocumentId,
    };
  }

  // Endpoint para buscar un usuario por su nombre de usuario
  @Get(":username")
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param("username") username: string,
  ): Promise<User | null | string> {
    try {
      return await this.userService.findByUsername(username);
    } catch (error) {
      throw new Error("User not found " + error.message);
    }
  }

  @Get("/document-id/:documentId")
  @UseGuards(JwtAuthGuard)
  async findByDocumentId(
    @Param("documentId") documentId: string,
  ): Promise<UserBasicDto | null | string> {
    try {
      return await this.userService.findByDocumentId(documentId);
    } catch (error) {
      throw new Error("User not found " + error.message);
    }
  }

  // Endpoint para buscar un usuario por su correo electrónico
  @Get("/email/:email")
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Param("email") email: string): Promise<User | null> {
    return await this.userService.findByEmail(email);
  }

  // Endpoint para crear un nuevo usuario
  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() userDto: UserDto): Promise<User> {
    return await this.userService.createUser(userDto);
  }

  // Endpoint para eliminar un usuario por su ID
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param("id") id: number): Promise<string> {
    await this.userService.deleteUser(id);
    return "User deleted successfully";
  }
}
