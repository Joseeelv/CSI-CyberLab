import { ConflictException, NotFoundException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/role/role.entity';
import { RegisterUserDto } from '../auth/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';

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
    const buscado = await this.userRepository.findOne({
      where: { email },
      relations: ['roleId'], // Incluir la relación del rol
    });
    console.log('Usuario buscado por email:', buscado);
    return buscado;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['roleId'], // Incluir la relación del rol
    });
  }

  // Obtener todos los usuarios 
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['roleId', 'containers', 'labs'],
    });
  }

  //Obtener el conteo de usuarios (estudiantes)
  async countUsers(): Promise<number> {
    return await this.userRepository.count({ where: { roleId: { id: 2 } } });
  }

  // Actualizar un usuario por su ID
  async updateUser(id: number, updateData: UserDto): Promise<User> {
    // Buscar el usuario por ID
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validar y asignar el rol si se proporciona
    if (updateData.roleId) {
      const roleId = Number(updateData.roleId);
      if (isNaN(roleId)) {
        throw new ConflictException('Invalid roleId');
      }

      const roleEntity = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!roleEntity) {
        throw new NotFoundException('Role not found');
      }
      user.roleId = roleEntity; // Asignar el rol al usuario
    }

    // Validar el correo electrónico si se proporciona
    if (updateData.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: updateData.email } });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use');
      }
      user.email = updateData.email; // Actualizar el correo
    }

    // Actualizar otros campos
    if (updateData.fullName) user.fullName = updateData.fullName;
    if (updateData.username) user.username = updateData.username;
    if (updateData.password) user.password = updateData.password;

    // Guardar los cambios
    await this.userRepository.save(user);
    return user;
  }

  // Eliminar un usuario por su ID
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
