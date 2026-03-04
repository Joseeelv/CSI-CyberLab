import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserService } from "../users/user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { LabService } from "../labs/lab.service";
import { UserLabService } from "../user-lab/user-lab.service";
import { AuthService } from "../auth/auth.service";
import { UserDto } from "src/users/user.dto";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly labService: LabService,
    private readonly userLabService: UserLabService,
    private readonly authService: AuthService,
  ) {}

  @Get("get-users")
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Post("create-teacher")
  @UseGuards(JwtAuthGuard)
  async createTeacher(@Body() createTeacherDto: UserDto) {
    return this.authService.register(createTeacherDto);
  }

  @Patch("update-user/:id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: number, @Body() updateUserDto: UserDto) {
    const documentId = await this.userService.find(id);
    console.log("Found documentId:", documentId);
    if (!documentId) {
      throw new Error("User not found");
    }
    return this.userService.updateUser(documentId, updateUserDto);
  }

  @Delete("remove-user/:id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: number) {
    return this.userService.remove(id);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.adminService.remove(+id);
  // }
}
