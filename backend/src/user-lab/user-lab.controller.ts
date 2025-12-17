import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserLabService } from "./user-lab.service";
import { UserLab } from "./user-lab.entity";
import { UserLabDto } from "./dto/user-lab.dto";

@Controller("user-lab")
export class UserLabController {
  constructor(private readonly userLabService: UserLabService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query("labUuid") labUuid?: string): Promise<UserLab[]> {
    // Si se proporciona labUuid, filtrar por ese laboratorio
    if (labUuid) {
      return this.userLabService.findByLabUuid(labUuid);
    }
    // Si no, devolver todos
    return this.userLabService.findAll();
  }

  @Get("by-id/:id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<UserLab> {
    return this.userLabService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() userLab: UserLabDto): Promise<UserLab> {
    return this.userLabService.create(userLab);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() userLabDto: UserLabDto,
  ): Promise<UserLab> {
    const updateData: Partial<UserLab> = {
      progress: userLabDto.progress,
      score: userLabDto.score,
      isFinished: userLabDto.isFinished,
    };

    if (userLabDto.started) {
      updateData.started = new Date(userLabDto.started);
    }

    return this.userLabService.update(id, updateData);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.userLabService.delete(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAll(): Promise<void> {
    return this.userLabService.deleteAll();
  }
}
