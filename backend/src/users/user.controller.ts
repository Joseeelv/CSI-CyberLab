import { Controller, Res, Req } from '@nestjs/common';
import { Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  // Endpoint para obtener todos los usuarios
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  //Endpoitn para obtener el número de estudiantes registrados
  @Get('count')
  async getCount() {
    const count = await this.userService.countUsers();
    return { count };
  }

  // Endpoint para actualizar un usuario por su ID
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: UserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    try {
      const updatedUser = await this.userService.updateUser(id, updateData);
      // Si se actualiza email, username o password, emitir nuevo JWT
      const sensitiveFields = ['email', 'username', 'password'];
      const changedSensitive = sensitiveFields.some(field => field in updateData);
      if (changedSensitive) {
        // Generar nuevo JWT
        const payload = {
          id: updatedUser.id,
          name: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.roleId,
        };
        const jwt = this.jwtService.sign(payload);
        res.cookie('jwt', jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 3600000,
        });
        return { message: 'Usuario actualizado y nueva sesión emitida', user: updatedUser, accessToken: jwt };
      }
      return { message: 'Usuario actualizado', user: updatedUser };
    } catch (error) {
      throw new Error('User not found ' + error.message);
    }
  }

  // Endpoint para buscar un usuario por su nombre de usuario
  @Get(':username')
  findOne(@Param('username') username: string): Promise<User | null | String> {
    try {
      return this.userService.findByUsername(username);
    } catch (error) {
      throw new Error('User not found ' + error.message);
    }
  }

  // Endpoint para buscar un usuario por su correo electrónico
  @Get('/email/:email')
  findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  // Endpoint para crear un nuevo usuario
  @Post()
  createUser(@Body() userDto: UserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  // Endpoint para eliminar un usuario por su ID
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<String> {
    await this.userService.deleteUser(id);
    return "User deleted successfully";
  }
}
