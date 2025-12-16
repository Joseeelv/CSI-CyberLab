import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Post()
  async createRole(@Body() createRoleDto): Promise<Role> {
    if (!createRoleDto.name) {
      throw new BadRequestException('Role name is required');
    }
    return this.roleService.createRole(createRoleDto);
  }

  @Get(':id')
  async findRoleById(@Param('id') id: number): Promise<Role | null> {
    const role = await this.roleService.findRoleById(id);
    if (!role) {
      throw new BadRequestException(`Role with ID ${id} not found`);
    }
    return role;
  }
}