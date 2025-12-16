import { Controller } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
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
    return this.roleService.createRole(createRoleDto);
  }

  @Get(':id')
  async findRoleById(@Param('id') id: number): Promise<Role | null> {
    return this.roleService.findRoleById(id);
  }
}