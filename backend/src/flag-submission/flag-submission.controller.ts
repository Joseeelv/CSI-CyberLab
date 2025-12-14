import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  ConflictException,
  NotFoundException,
  Query,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { FlagSubmissionService } from './flag-submission.service';
import { FlagSubmission } from './flag-submission.entity';

@Controller('flag-submission')
export class FlagSubmissionController {
  constructor(private readonly flagSubmissionService: FlagSubmissionService) { }

  @Get()
  async getSubmissions(
    @Query('userId') userId?: number,
    @Query('labUuid') labUuid?: string
  ): Promise<FlagSubmission[]> {
    const where: any = {};

    if (userId) {
      where.user = { id: userId };
    }

    if (labUuid) {
      where.lab = { uuid: labUuid };
    }

    return await this.flagSubmissionService.find(where);
  }

  // Endpoint específico para obtener el progreso de un usuario en un lab
  @Get('progress/:userId/:labUuid')
  async getUserProgress(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('labUuid') labUuid: string
  ) {
    return await this.flagSubmissionService.getUserLabProgress(userId, labUuid);
  }

  @Post()
  async SubmitFlag(@Body() flagSubmissionData: {
    labUuid: string;
    flag: string;
    userId: number
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
  async deleteAllFlagSubmissions() {
    return await this.flagSubmissionService.deleteAllFlagSubmissions();
  }

  @Delete(':id')
  async deleteFlagSubmission(@Param('id', ParseIntPipe) id: number) {
    return await this.flagSubmissionService.deleteFlagSubmission(id);
  }
}