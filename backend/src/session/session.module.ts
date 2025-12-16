import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService], // Exportar SessionService para que otros módulos puedan usarlo
})
export class SessionModule {}
