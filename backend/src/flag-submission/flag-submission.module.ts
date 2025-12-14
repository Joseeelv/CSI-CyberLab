import { Module } from '@nestjs/common';
import { FlagSubmissionService } from './flag-submission.service';
import { FlagSubmissionController } from './flag-submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagSubmission } from './flag-submission.entity';
import { Lab } from 'src/labs/lab.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlagSubmission, Lab, User])],
  providers: [FlagSubmissionService],
  controllers: [FlagSubmissionController]
})

export class FlagSubmissionModule { }
