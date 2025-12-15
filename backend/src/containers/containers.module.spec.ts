import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContainersModule } from "./containers.module";
import { Container } from "./container.entity";
import { Image } from "../images/image.entity";
import { Status } from "../status/status.entity";
import { Lab } from "../labs/lab.entity";
import { User } from "../users/user.entity";
import { DockerService } from "../docker/docker.service";
import { OperatingSystem } from "../operating-systems/os.entity";
import { Role } from "../role/role.entity";
import { UserLab } from "../user-lab/user-lab.entity";
import { FlagSubmission } from "../flag-submission/flag-submission.entity";
import { Category } from "../categories/category.entity";
import { Difficulty } from "../difficulty/difficulty.entity";
import { AuthModule } from "../auth/auth.module";

describe("ContainersModule", () => {
  let module: ContainersModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: "test" }),
        AuthModule,
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.TEST_DB_HOST || "localhost",
          port: +(process.env.TEST_DB_PORT || 5432),
          username: process.env.TEST_DB_USER || "user",
          password: process.env.TEST_DB_PASS || "secret",
          database: process.env.TEST_DB_NAME || "postgres-db",
          dropSchema: true,
          entities: [
            Container,
            Image,
            Status,
            Lab,
            User,
            OperatingSystem,
            Role,
            UserLab,
            FlagSubmission,
            Category,
            Difficulty,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          Container,
          Image,
          Status,
          Lab,
          User,
          OperatingSystem,
          Role,
          UserLab,
          FlagSubmission,
          Category,
          Difficulty,
        ]),
        ContainersModule,
      ],
      providers: [
        {
          provide: DockerService,
          useValue: {},
        },
        // JwtService ya es proporcionado por AuthModule
        {
          provide: APP_GUARD,
          useClass: class {
            canActivate() {
              return true;
            }
          },
        },
      ],
    }).compile();
    module = testingModule.get<ContainersModule>(ContainersModule);
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
