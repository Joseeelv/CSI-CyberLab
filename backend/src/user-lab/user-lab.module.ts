import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLab } from "./user-lab.entity";
import { User } from "../users/user.entity";
import { UserLabService } from "./user-lab.service";
import { UserLabController } from "./user-lab.controller";
import { UserExistsConstraint } from "./dto/user-exists.validator";
import { LabExistsConstraint } from "./dto/lab-exists.validator";
import { Lab } from "src/labs/lab.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserLab, User, Lab])],
  providers: [UserLabService, UserExistsConstraint, LabExistsConstraint],
  controllers: [UserLabController],
  exports: [UserLabService],
})
<<<<<<< HEAD
export class UserLabModule { }
=======
export class UserLabModule {}
>>>>>>> f8dcc52 (Refactor code style and improve consistency across user-lab and user modules)
