import { Controller } from '@nestjs/common';
import { Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RegisterUserDto } from '../auth/register.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Endpoint para obtener todos los usuarios
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Endpoint para actualizar un usuario por su ID
  @Put('/update-user/:id')
  updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userService.updateUser(id, updateData);
  }

  // Endpoint para buscar un usuario por su nombre de usuario
  @Get(':username')
  findOne(@Param('username') username: string): Promise<User | null> {
    return this.userService.findByUsername(username);
  }

  // Endpoint para buscar un usuario por su correo electrónico
  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  // Endpoint para crear un nuevo usuario
  @Post()
  createUser(@Body() userDto: RegisterUserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  // Endpoint para eliminar un usuario por su ID
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
