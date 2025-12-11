import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Container } from "./container.entity";
import { ContainerService } from "./container.service";
import { ContainerController } from "./container.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainerController],
  providers: [ContainerService],
  exports: [ContainerService],
})
export class ContainersModule {} 