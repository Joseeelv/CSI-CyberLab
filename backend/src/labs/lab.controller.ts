import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { LabService } from './lab.service';
import { Lab } from './lab.entity';
import { LabDto } from './lab.dto';

@Controller('labs')
export class LabsController {
  constructor(private readonly labService: LabService) { }

  @Get()
  async getLabs() {
    return await this.labService.getAllLabs();
  }

  @Post()
  async createLabDirect(@Body() labData: LabDto) {
    return await this.labService.createLab(labData);
  }

  @Post('create')
  async createLab(@Body() labData: LabDto) {
    return await this.labService.createLab(labData);
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLabDto: LabDto) {
    return this.labService.create(createLabDto);
  }
  
  @Put(':name')
  // @UseGuards(JwtAuthGuard)
  async update(
    @Param('name') name: string,
    @Body() updateLabDto: LabDto,
  ) {
    return this.labService.update(name, updateLabDto);
  }

  @Delete(':name')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('name') name: string) {
    await this.labService.remove(name);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll() {
    await this.labService.removeAll();
  }

}
