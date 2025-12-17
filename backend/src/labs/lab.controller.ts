import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { LabService } from "./lab.service";
import { LabDto } from "./dto/lab.dto";

@Controller("labs")
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Get("activated")
  @UseGuards(JwtAuthGuard)
  async getLabsActivated() {
    return await this.labService.getActivatedLabs();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllLabs() {
    return await this.labService.getAllLabs();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLabDto: LabDto) {
    return this.labService.createLab(createLabDto);
  }

  @Patch(":uuid")
  @UseGuards(JwtAuthGuard)
  async update(@Param("uuid") uuid: string, @Body() updateLabDto: LabDto) {
    return this.labService.update(uuid, updateLabDto);
  }

  @Patch("status/:uuid")
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("uuid") uuid: string,
    @Body("statusId") statusId: number,
  ) {
    return this.labService.setLabStatus(uuid, statusId);
  }

  @Delete(":uuid")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("uuid") uuid: string) {
    await this.labService.remove(uuid);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll() {
    await this.labService.removeAll();
  }
}
