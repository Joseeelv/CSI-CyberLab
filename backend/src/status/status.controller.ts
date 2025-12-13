import { Controller, Body, Get, Post, NotFoundException } from '@nestjs/common';
import { Status } from './status.entity';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) { }

  @Get()
  async getStatuses() {
    try {
      return await this.statusService.getAllStatuses();
    } catch (error) {
      throw new NotFoundException(`Could not retrieve statuses: ${error.message}`);
    }
  }

  @Post()
  async createStatus(@Body() statusData: Partial<Status>) {
    if (!statusData.name) {
      throw new NotFoundException(`Status name is required`);
    }
    const existStatus = await this.statusService.findByName(statusData.name);
    if (existStatus) {
      throw new NotFoundException(`Status with name ${statusData.name} already exists`);
    }
    return await this.statusService.createStatus(statusData);
  }
}
