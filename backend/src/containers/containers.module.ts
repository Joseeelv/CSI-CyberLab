import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Container } from "./container.entity";
import { ContainerService } from "./container.service";
import { ContainerController } from "./container.controller";
import { DockerService } from "../docker/docker.service";

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainerController],
  providers: [ContainerService, DockerService],
  exports: [ContainerService, DockerService],
})
export class ContainersModule {}
