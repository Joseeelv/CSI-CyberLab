import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { RoleModule } from './role/role.module';
import { SeederModule } from './database/seeder.module';
import { ChallengeService } from './challenge/challenge.service';
import { ChallengeController } from './challenge/challenge.controller';
import { ChallengeModule } from './challenge/challenge.module';

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
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
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
    LabsModule,
    DifficultyModule,
    RoleModule,
    SeederModule,
    ChallengeModule,
  ],
  controllers: [AppController, ChallengeController],
  providers: [AppService, ChallengeService],
})
export class AppModule { }