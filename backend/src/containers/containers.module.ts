import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Container } from "./container.entity";
import { Image } from "src/images/image.entity";
import { Status } from "src/status/status.entity";
import { Lab } from "src/labs/lab.entity";
import { User } from "src/users/user.entity";
import { ContainerService } from "./container.service";
import { ContainerController } from "./container.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Container, Image, Status, Lab, User])],
  controllers: [ContainerController],
  providers: [ContainerService],
  exports: [ContainerService],
})
export class ContainersModule { } 