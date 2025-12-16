import { Controller, Get, Post, Patch, Body, Delete, ConflictException, NotFoundException } from '@nestjs/common';
import { FlagSubmissionService } from './flag-submission.service';
import { FlagSubmission } from './flag-submission.entity';

@Controller('flag-submission')
export class FlagSubmissionController {
  constructor(private readonly flagSubmissionService: FlagSubmissionService) { }

  @Get()
  getAllFlagSubmissions() {
    return this.flagSubmissionService.getAllFlagSubmissions();
  }

  @Post()
  async SubmitFlag(@Body() flagSubmissionData: { labUuid: string; flag: string; userId: number }) {
    try {

      await this.flagSubmissionService.SubmitFlag(flagSubmissionData);
      return { message: 'Flag enviada correctamente', status: 'success' };
    } catch (error) {
      console.error('Error processing flag submission:', error);
      // Si el error ya es una excepción de NestJS, relánzala para mantener el mensaje original
      if (error.getStatus && error.getResponse) {
        throw error;
      }
      // Si no, lanza un error genérico
      throw new ConflictException('Error creando flag submission');
    }
  }

  @Patch(':id')
  updateFlagSubmission(@Body('id') id: number, @Body() updateData: Partial<FlagSubmission>) {
    try {
      const flag = this.flagSubmissionService.findById(id);
      if (!flag) {
        throw new NotFoundException(`FlagSubmission with id ${id} not found`);
      }
      return this.flagSubmissionService.updateFlagSubmission(id, updateData);
    } catch (error) {
      throw new NotFoundException(`FlagSubmission with id ${id} not found`);
    }
  }

  @Delete()
  async deleteAllFlagSubmissions() {
    return this.flagSubmissionService.deñleteAllFlagSubmissions();
  }
}