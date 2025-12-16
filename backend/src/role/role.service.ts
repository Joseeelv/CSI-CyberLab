import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  async findRoleById(id: number): Promise<Role | null> {
    try {
      return await this.roleRepository.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Role not found');
    }
  }

  async getAllRoles(): Promise<any[]> {
    const roles = await this.roleRepository.find();
    return roles.map(r => instanceToPlain(r));
  }

  async getRoleById(id: number): Promise<Role> {
    try {

      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        throw new Error('Role not found');
      }
      return role;
    } catch (error) {
      throw new Error(`Failed to get role by id: ${error.message}`);
    }
  }
}