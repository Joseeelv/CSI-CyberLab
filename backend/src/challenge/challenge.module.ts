import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './challenge.entity';
import { Lab } from 'src/labs/lab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Lab])],
  providers: [ChallengeService],
  controllers: [ChallengeController],
})
export class ChallengeModule { }
