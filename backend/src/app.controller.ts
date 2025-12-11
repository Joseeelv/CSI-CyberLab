// app.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return {
      message: this.appService.getHello(),
    };
  }

  @Get('status')
  async getStatus(): Promise<{ status: string; timestamp: string }> {
    try {
      const status = await this.appService.getDatabaseStatus();
      return {
        status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        'Error al conectar con la base de datos',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}