import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserLabService } from './user-lab.service';
import { UserLab } from './user-lab.entity';

@Controller('user-labs')
export class UserLabController {
  constructor(private readonly userLabService: UserLabService) {}

  @Get()
  async findAll(): Promise<UserLab[]> {
    return this.userLabService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserLab> {
    return this.userLabService.findOne(id);
  }

  @Post()
  async create(@Body() userLab: Partial<UserLab>): Promise<UserLab> {
    return this.userLabService.create(userLab);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() userLab: Partial<UserLab>): Promise<UserLab> {
    return this.userLabService.update(id, userLab);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userLabService.delete(id);
  }
}