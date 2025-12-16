import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { getDatabaseConfig } from './config/database.config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ContainerModule } from './containers/container.module';
import { StatusModule } from './status/status.module';
import { OperatingSystemsModule } from './operating-systems/os.module';
import { CategoryModule } from './categories/category.module';
import { ImageModule } from './images/image.module';
import { LabsModule } from './labs/lab.module';
import { DifficultyModule } from './difficulty/difficulty.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { SessionModule } from './session/session.module';
import { DockerModule } from './docker/docker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 100, // 100 requests por minuto
    }]),

    // TypeORM con configuración mejorada
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    
    UserModule,
    AuthModule,
    ContainerModule,
    StatusModule,
    OperatingSystemsModule,
    CategoryModule,
    ImageModule,
    LabsModule,
    DifficultyModule,
    RoleModule,
    SessionModule,
    DockerModule,
  ],
  controllers: [AppController, RoleController],
  providers: [
    AppService,
    // Aplicar filtro global de excepciones
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Aplicar interceptor de logging
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Aplicar rate limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}