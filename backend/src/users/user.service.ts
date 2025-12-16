import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Session } from 'src/session/session.entity';
import { RegisterUserDto } from '../auth/register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) { }

  async createUser(userDto: RegisterUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(userDto);
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created: ${savedUser.email}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new BadRequestException('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${error.message}`);
      throw new BadRequestException('Failed to find user by email');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(`Failed to find user by username: ${error.message}`);
      throw new BadRequestException('Failed to find user by username');
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ data: User[]; total: number }> {
    try {
      const [data, total] = await this.userRepository.findAndCount({
        relations: ['role'],
        skip: (page - 1) * limit,
        take: limit,
        order: { created: 'DESC' },
      });
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to find users: ${error.message}`);
      throw new BadRequestException('Failed to find users');
    }
  }

  async countUsers(): Promise<number> {
    try {
      return await this.userRepository.count({ where: { role: { id: 2 } } });
    } catch (error) {
      this.logger.error(`Failed to count users: ${error.message}`);
      throw new BadRequestException('Failed to count users');
    }
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateData);

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`User updated: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      //Primero eliminar sesiones asociadas al usuario y luego el usuario
      await this.sessionRepository.delete({ user: { id: user.id } });
      await this.userRepository.delete(user.id);
      this.logger.log(`User deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete user');
    }
  }
}
