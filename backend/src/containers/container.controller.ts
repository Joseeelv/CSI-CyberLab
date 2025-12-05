import { Controller } from '@nestjs/common';
import { ContainerService } from './container.service';
import { Get, Post, Param, Body } from '@nestjs/common';

@Controller('containers')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) { }

  @Get()
  async getContainers() {
    return await this.containerService.getContainers();
  }
}
