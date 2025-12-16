import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Status } from 'src/status/status.entity';
import { Difficulty } from 'src/difficulty/difficulty.entity';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Category } from 'src/categories/category.entity';
import { Role } from 'src/role/role.entity';
import { Image } from 'src/images/image.entity';
import { Container } from 'src/containers/container.entity';
import { Lab } from 'src/labs/lab.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Status,
      Difficulty,
      OperatingSystem,
      Category,
      Role,
      Image,
      Container,
      Lab,
    ]),
  ],
  controllers: [SeederController],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
