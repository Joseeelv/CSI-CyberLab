import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
import { ContainerModule } from "./containers/container.module";
import { StatusModule } from "./status/status.module";
import { OperatingSystemsModule } from "./operating-systems/os.module";
import { CategoryModule } from "./categories/category.module";
import { ImageModule } from "./images/image.module";
import { LabModule } from "./labs/lab.module";
import { DifficultyModule } from "./difficulty/difficulty.module";
import { RoleModule } from "./role/role.module";
import { SeederModule } from "./database/seeder.module";
import { FlagSubmissionModule } from "./flag-submission/flag-submission.module";
import { UserLabModule } from "./user-lab/user-lab.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // Usar variables de entorno del sistema (docker-compose)
    }),

    // TypeORM con ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST") || "localhost",
        port: configService.get<number>("DATABASE_PORT") || 5432,
        username: configService.get("DATABASE_USER") || "user",
        password: configService.get("DATABASE_PASSWORD") || "secret",
        database: configService.get("DATABASE_NAME") || "postgres-db",
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    
    UserModule,
    AuthModule,
    ContainerModule,
    StatusModule,
    OperatingSystemsModule,
    CategoryModule,
    ImageModule,
    LabModule,
    DifficultyModule,
    RoleModule,
    SeederModule,
    FlagSubmissionModule,
    UserLabModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
