import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Session } from 'src/session/session.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
