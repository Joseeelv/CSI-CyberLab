import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from 'src/role/role.entity';
import { Container } from 'src/containers/container.entity';
import { Lab } from 'src/labs/lab.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FlagSubmission } from 'src/flag-submission/flag-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Container, Lab, FlagSubmission])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
