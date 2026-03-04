import { Controller, Delete, Param } from "@nestjs/common";
import { SessionService } from "./session.service";
import { Get } from "@nestjs/common";
@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getAllSessions() {
    return await this.sessionService.getAllSessions();
  }

  @Delete(":id")
  async deleteSession(@Param("id") id: number) {
    return await this.sessionService.deleteSession(id);
  }
}
