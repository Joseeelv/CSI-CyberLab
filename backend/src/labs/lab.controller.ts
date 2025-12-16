import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LabService } from './lab.service';
import { LabDto } from './dto/lab.dto';

@Controller('labs')
export class LabsController {
  constructor(private readonly labService: LabService) { }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getLabs() {
    return await this.labService.getAllLabs();
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLabDto: LabDto) {
    return this.labService.createLab(createLabDto);
  }


  @Put(':name')
  @UseGuards(JwtAuthGuard)
  async update(@Param('name') name: string, @Body() updateLabDto: LabDto) {
    return this.labService.update(name, updateLabDto);
  }


  @Delete(':name')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('name') name: string) {
    await this.labService.remove(name);
  }


  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll() {
    await this.labService.removeAll();
  }

}