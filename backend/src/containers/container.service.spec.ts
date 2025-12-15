import { Test, TestingModule } from "@nestjs/testing";
import { ContainerService } from "./container.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Container } from "./container.entity";
import { Image } from "../images/image.entity";
import { Status } from "../status/status.entity";
import { Lab } from "../labs/lab.entity";
import { User } from "../users/user.entity";
import { DockerService } from "../docker/docker.service";

describe("ContainerService", () => {
  let service: ContainerService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContainerService,
        { provide: getRepositoryToken(Container), useValue: mockRepository },
        { provide: getRepositoryToken(Image), useValue: mockRepository },
        { provide: getRepositoryToken(Status), useValue: mockRepository },
        { provide: getRepositoryToken(Lab), useValue: mockRepository },
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: DockerService, useValue: {} },
      ],
    }).compile();

    service = module.get<ContainerService>(ContainerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
