import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from '../auth/register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  // Inyectar el repositorio de usuarios
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }


  // Crear un nuevo usuario
  async createUser(userDto: RegisterUserDto): Promise<User> {
    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  // Buscar un usuario por su correo electrónico
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Actualizar un usuario por su ID
  async updateUser(id: number, updateData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  // Eliminar un usuario por su ID
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
  }
}
