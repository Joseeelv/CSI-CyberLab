import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
    return await this.roleRepository.findOne({ where: { id } });
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
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