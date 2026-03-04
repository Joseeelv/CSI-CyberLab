import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get("NODE_ENV") === "production";

  return {
    type: "postgres",
    host: configService.get("DATABASE_HOST"),
    port: configService.get<number>("DATABASE_PORT"),
    username: configService.get("DATABASE_USER"),
    password: configService.get("DATABASE_PASSWORD"),
    database: configService.get("DATABASE_NAME"),
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: !isProduction,
    logging: !isProduction ? ["error", "warn", "migration"] : ["error"],
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    migrationsRun: isProduction,
    // Configuración de pool para mejor rendimiento
    extra: {
      max: 20,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 30000,
    },
  };
};
