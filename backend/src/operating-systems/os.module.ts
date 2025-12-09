import { Module } from '@nestjs/common';
import { OperatingSystemsService } from './os.service';
import { OperatingSystemsController } from './os.controller';
import { OperatingSystem } from './os.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([OperatingSystem])],
  providers: [OperatingSystemsService],
  controllers: [OperatingSystemsController]
})
export class OperatingSystemsModule {}
