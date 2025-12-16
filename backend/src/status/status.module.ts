import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { Status } from "./status.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
