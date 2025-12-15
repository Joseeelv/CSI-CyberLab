import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Difficulty } from "./difficulty.entity";
import { DifficultiesController } from "./difficulty.controller";
import { DifficultyService } from "./difficulty.service";

@Module({
  imports: [TypeOrmModule.forFeature([Difficulty])],
  controllers: [DifficultiesController],
  providers: [DifficultyService],
})
export class DifficultyModule {}
