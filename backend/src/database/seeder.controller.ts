import { Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { SeederService } from "./seeder.service";

@Controller("seed")
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    return await this.seederService.seed();
  }
}
