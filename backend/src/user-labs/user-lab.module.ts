import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLab } from './user-lab.entity';
import { UserLabService } from './user-lab.service';
import { UserLabController } from './user-lab.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserLab])],
  providers: [UserLabService],
  controllers: [UserLabController],
  exports: [UserLabService],
})
export class UserLabModule {}