import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lab } from './lab.entity';
import { LabsController } from './lab.controller';
import { LabService } from './lab.service';
import { FlagSubmission } from 'src/flag-submission/flag-submission.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Lab, FlagSubmission])],
  controllers: [LabsController],
  providers: [LabService],
})
export class LabModule { }
