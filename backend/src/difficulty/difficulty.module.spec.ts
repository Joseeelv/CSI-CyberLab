import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DifficultyModule } from "./difficulty.module";
import { Difficulty } from "./difficulty.entity";
import { Lab } from "../labs/lab.entity";
import { Status } from "../status/status.entity";
import { Role } from "../role/role.entity";
import { User } from "../users/user.entity";
import { DockerService } from "../docker/docker.service";
import { UserLab } from "../user-lab/user-lab.entity";
import { FlagSubmission } from "../flag-submission/flag-submission.entity";
import { Category } from "../categories/category.entity";
import { Container } from "../containers/container.entity";
import { Image } from "../images/image.entity";
import { OperatingSystem } from "../operating-systems/os.entity";

describe("DifficultyModule", () => {
  let module: DifficultyModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [
            Difficulty,
            Lab,
            Status,
            Role,
            User,
            UserLab,
            FlagSubmission,
            Category,
            Container,
            Image,
            OperatingSystem,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          Difficulty,
          Lab,
          Status,
          Role,
          User,
          UserLab,
          FlagSubmission,
          Category,
          Container,
          Image,
          OperatingSystem,
        ]),
        DifficultyModule,
      ],
      providers: [
        {
          provide: DockerService,
          useValue: {},
        },
      ],
    }).compile();
    module = testingModule.get<DifficultyModule>(DifficultyModule);
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
