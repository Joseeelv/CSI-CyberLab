import { Module } from '@nestjs/common';
import { FlagSubmissionService } from './flag-submission.service';
import { FlagSubmissionController } from './flag-submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagSubmission } from './flag-submission.entity';
import { UserLab } from 'src/user-lab/user-lab.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([FlagSubmission, UserLab])],
  providers: [FlagSubmissionService, JwtAuthGuard],
  controllers: [FlagSubmissionController]
})

export class FlagSubmissionModule { }
