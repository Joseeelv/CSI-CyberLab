import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/role/role.entity';
import { RegisterUserDto } from '../auth/register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  // Inyectar el repositorio de usuarios
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

  //Obtener el conteo de usuarios (estudiantes)
  async countUsers(): Promise<number> {
    return await this.userRepository.count({ where: { roleId: { id: 2 } } });
  }

  // Actualizar un usuario por su ID
  async updateUser(id: number, updateData: Partial<User>): Promise<User | null | String> {
    const roleId = updateData.roleId;
    const user = await this.userRepository.findOne({ where: { id } });
    const roleIdNumber = typeof roleId === 'object' ? roleId?.id : roleId;
    const role = await this.roleRepository.findOne({ where: { id: roleIdNumber } });
    if (!user) {
      throw new Error('User not found');
    }

    if (role) {
      user.roleId = role;
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
