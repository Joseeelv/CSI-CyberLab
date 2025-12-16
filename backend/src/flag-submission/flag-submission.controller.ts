import { Controller, Get, Post, Patch, Body, Delete, ConflictException, NotFoundException, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FlagSubmissionService } from './flag-submission.service';
import { FlagSubmission } from './flag-submission.entity';

@Controller('flag-submission')
export class FlagSubmissionController {
  constructor(private readonly flagSubmissionService: FlagSubmissionService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubmissions(
    @Query('userId') userId?: string,
    @Query('labUuid') labUuid?: string
  ): Promise<FlagSubmission[]> {
    try {
      // Llamar al servicio sin argumentos
      const allSubmissions = await this.flagSubmissionService.find();

      // Filtrar en el controlador si es necesario
      let results = allSubmissions;

      if (userId) {
        results = results.filter(sub => sub.userLab?.userId === userId);
      }

      if (labUuid) {
        results = results.filter(sub => sub.labId === labUuid);
      }

      return results || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }

  // Endpoint específico para obtener el progreso de un usuario en un lab
  @Get('progress/:userId/:labUuid')
  @UseGuards(JwtAuthGuard)
  async getUserProgress(
    @Param('userId') userId: string,
    @Param('labUuid') labUuid: string
  ) {
    return await this.flagSubmissionService.getUserLabProgress(userId, labUuid);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async SubmitFlag(@Body() flagSubmissionData: {
    labUuid: string;
    flag: string;
    userId: string
  }) {
    try {
      const result = await this.flagSubmissionService.SubmitFlag(flagSubmissionData);
      return {
        message: result.message,
        status: 'success',
        data: result
      };
    } catch (error) {
      console.error('Error processing flag submission:', error);

      // Re-lanzar errores HTTP de NestJS
      if (error.getStatus && error.getResponse) {
        throw error;
      }
      // Si no es un error HTTP conocido, lanza un error genérico
      throw new ConflictException('Error creando flag submission');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateFlagSubmission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<FlagSubmission>
  ) {
    try {
      const flag = await this.flagSubmissionService.findById(id);

      if (!flag) {
        throw new NotFoundException(`FlagSubmission with id ${id} not found`);
      }

      return await this.flagSubmissionService.updateFlagSubmission(id, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`FlagSubmission with id ${id} not found`);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAllFlagSubmissions() {
    return await this.flagSubmissionService.deleteAllFlagSubmissions();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteFlagSubmission(@Param('id', ParseIntPipe) id: number) {
    return await this.flagSubmissionService.deleteFlagSubmission(id);
  }
}