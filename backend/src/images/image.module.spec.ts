import "dotenv/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageModule } from "./image.module";
import { Image } from "./image.entity";
import { Container } from "../containers/container.entity";
import { Lab } from "../labs/lab.entity";
import { OperatingSystem } from "../operating-systems/os.entity";
import { Status } from "../status/status.entity";
import { User } from "../users/user.entity";
import { Role } from "../role/role.entity";
import { DockerService } from "../docker/docker.service";
import { UserLab } from "../user-lab/user-lab.entity";
import { FlagSubmission } from "../flag-submission/flag-submission.entity";
import { Category } from "../categories/category.entity";
import { Difficulty } from "../difficulty/difficulty.entity";

describe("ImageModule", () => {
  let module: ImageModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DATABASE_HOST,
          port: +(process.env.DATABASE_PORT ?? 5432),
          username: process.env.DATABASE_USER,
          password: String(process.env.DATABASE_PASSWORD),
          database: process.env.DATABASE_NAME,
          dropSchema: true,
          entities: [
            Image,
            Container,
            Lab,
            OperatingSystem,
            Status,
            User,
            Role,
            UserLab,
            FlagSubmission,
            Category,
            Difficulty,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          Image,
          Container,
          Lab,
          OperatingSystem,
          Status,
          User,
          Role,
          UserLab,
          FlagSubmission,
          Category,
          Difficulty,
        ]),
        ImageModule,
      ],
      providers: [
        {
          provide: DockerService,
          useValue: {},
        },
      ],
    }).compile();
    module = testingModule.get<ImageModule>(ImageModule);
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
