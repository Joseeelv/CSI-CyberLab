import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lab } from './lab.entity';
import { LabsController } from './lab.controller';
import { LabService } from './lab.service';
@Module({
  imports: [TypeOrmModule.forFeature([Lab])],
  controllers: [LabsController],
  providers: [LabService],
})
export class LabsModule { }
