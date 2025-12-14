import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLab } from './user-lab.entity';
import { UserLabService } from './user-lab.service';
import { UserLabController } from './user-lab.controller';
import { UserExistsConstraint } from './dto/user-exists.validator';
import { LabExistsConstraint } from './dto/lab-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserLab])],
  providers: [UserLabService, UserExistsConstraint, LabExistsConstraint],
  controllers: [UserLabController],
  exports: [UserLabService],
})
export class UserLabModule { }
