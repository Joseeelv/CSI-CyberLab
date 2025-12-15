import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lab } from './lab.entity';
import { LabsController } from './lab.controller';
import { LabService } from './lab.service';
import { FlagSubmission } from 'src/flag-submission/flag-submission.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Lab, FlagSubmission]), AuthModule],
  controllers: [LabsController],
  providers: [LabService, JwtAuthGuard],
})
export class LabModule { }
