import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLab } from './user-lab.entity';
import { User } from '../users/user.entity';
import { UserLabService } from './user-lab.service';
import { UserLabController } from './user-lab.controller';
import { UserExistsConstraint } from './dto/user-exists.validator';
import { LabExistsConstraint } from './dto/lab-exists.validator';
import { AppModule } from 'src/app.module';
import { Lab } from 'src/labs/lab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLab, User, Lab])],
  providers: [UserLabService, UserExistsConstraint, LabExistsConstraint],
  controllers: [UserLabController],
  exports: [UserLabService],
})
export class UserLabModule { }