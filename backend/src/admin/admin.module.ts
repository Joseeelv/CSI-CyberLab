import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { UserService } from "src/users/user.service";
import { LabService } from "src/labs/lab.service";
import { UserLabService } from "src/user-lab/user-lab.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserModule } from "../users/user.module";
import { LabModule } from "src/labs/lab.module";
import { UserLabModule } from "../user-lab/user-lab.module";
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [UserModule, UserLabModule, LabModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    UserService,
    LabService,
    UserLabService,
    JwtAuthGuard,
    AuthService,
  ],
})
export class AdminModule {}
