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
  findAll(): Promise<{ data: User[]; total: number }> {
    return this.userService.findAll();
  }

  @Get('count')
  async getCount() {
    const count = await this.userService.countUsers();
    return { count };
  }

  @Put('/update-user/:id')
  updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userService.updateUser(id, updateData);
  }

  @Get(':username')
  findOne(@Param('username') username: string): Promise<User | null> {
    return this.userService.findByUsername(username);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  @Post()
  createUser(@Body() userDto: RegisterUserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
