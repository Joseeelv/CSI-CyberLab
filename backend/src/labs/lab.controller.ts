import { Controller, Put } from '@nestjs/common';
import { Get, Post, Param, Body} from '@nestjs/common';
import { LabService } from './lab.service';
import { Lab } from './lab.entity';
import { LabDto } from './dto/lab.dto';

@Controller('labs')
export class LabsController {

  constructor(private readonly labService: LabService) {}

  @Get()
  async getLabs() {
    return await this.labService.getAllLabs();
  }

  @Post('create')
  async createLab(@Body() labData) {
    return await this.labService.createLab(labData);
  }

  @Get(':uuid')
  async getLabById(@Param('uuid') uuid: string) {
    return await this.labService.findLabById(uuid);
  }

  @Post('update/:uuid')
  async updateLab(@Param('uuid') uuid: string, @Param() updateData: Partial<Lab>) {
    return await this.labService.updateLab(uuid, updateData);
  }

  @Put('delete/:uuid')
  async deleteLab(@Param('uuid') uuid: string) {
    return await this.labService.deleteLab(uuid);
  }
}
