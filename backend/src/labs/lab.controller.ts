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
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('labs')
export class LabsController {
  constructor(private readonly labService: LabService) { }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.labService.findAll(+page, +limit);
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.labService.findOne(name);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLabDto: CreateLabDto) {
    return this.labService.create(createLabDto);
  }
  
  @Put(':name')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('name') name: string,
    @Body() updateLabDto: UpdateLabDto,
  ) {
    return this.labService.update(name, updateLabDto);
  }

  @Delete(':name')
  @UseGuards(JwtAuthGuard)
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
