import { Test, TestingModule } from "@nestjs/testing";
import { LabService } from "./lab.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Lab } from "./lab.entity";

describe("LabService", () => {
  let service: LabService;

  beforeEach(async () => {
    const mockLabRepository = {
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
        LabService,
        {
          provide: getRepositoryToken(Lab),
          useValue: mockLabRepository,
        },
      ],
    }).compile();

    service = module.get<LabService>(LabService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
