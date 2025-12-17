import { Controller, Get, Post, Body } from "@nestjs/common";
import { OperatingSystemsService } from "./os.service";
@Controller("operating-systems")
export class OperatingSystemsController {
  constructor(
    private readonly operatingSystemsService: OperatingSystemsService,
  ) {}
  @Get()
  async getOperatingSystems() {
    return await this.operatingSystemsService.getAll();
  }
  @Post("create")
  async createOS(@Body() data) {
    return await this.operatingSystemsService.createOS(data);
  }
}
