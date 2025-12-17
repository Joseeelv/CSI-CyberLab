import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { DifficultyService } from "./difficulty.service";
import { DifficultyDto } from "./difficulty.dto";
@Controller("difficulties")
export class DifficultiesController {
  constructor(private readonly difficultyService: DifficultyService) {}

  @Get()
  async getAll() {
    return await this.difficultyService.getAll();
  }

  @Post("create")
  async createDifficulty(@Body() data: DifficultyDto) {
    return await this.difficultyService.create(data);
  }

  @Get(":name")
  async getById(@Param("name") name: string) {
    return await this.difficultyService.findByName(name);
  }
}
