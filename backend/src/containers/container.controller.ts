import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ContainerService } from "./container.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("container")
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getContainers() {
    return await this.containerService.getContainers();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createContainer(@Body() containerData) {
    return await this.containerService.createContainer(containerData);
  }
}
