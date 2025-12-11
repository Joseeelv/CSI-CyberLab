import { Module } from "@nestjs/common";
import { ContainerController } from "./container.controller";
import { ContainerService } from "./container.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Container } from "./container.entity";
import { Image } from "src/images/image.entity";
import { Status } from "src/status/status.entity";
import { Lab } from "src/labs/lab.entity";
import { User } from "src/users/user.entity";
import { DockerModule } from "src/docker/docker.module";

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}
