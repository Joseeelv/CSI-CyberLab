import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lab } from './lab.entity';
import { Category } from 'src/categories/category.entity';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Difficulty } from 'src/difficulty/difficulty.entity';
import { Status } from 'src/status/status.entity';
import { Container } from 'src/containers/container.entity';
import { LabsController } from './lab.controller';
import { LabService } from './lab.service';
@Module({
  imports: [TypeOrmModule.forFeature([Lab, Category, OperatingSystem, Difficulty, Status, Container])],
  controllers: [LabsController],
  providers: [LabService],
})
export class LabsModule { }
