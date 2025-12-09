import { Module } from '@nestjs/common';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from './container.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}
