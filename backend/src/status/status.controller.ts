import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatusService } from './status.service';
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) { }

  @Get()
  async getStatuses() {
    return await this.statusService.getAllStatuses();
  }

  @Post()
  async createStatus(@Body() statusData) {
    return await this.statusService.createStatus(statusData);
  }
}
