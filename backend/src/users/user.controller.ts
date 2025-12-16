import { Controller } from '@nestjs/common';
import { Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
  @Put(':id')
  updateUser(@Param('id') id: number, @Body() updateData: UserDto,): Promise<User | String | null> {
    try {
      return this.userService.updateUser(id, updateData);
    }
    catch (error) {
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
