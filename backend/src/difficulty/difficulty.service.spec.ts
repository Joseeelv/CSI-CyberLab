import { Test, TestingModule } from "@nestjs/testing";
import { DifficultyService } from "./difficulty.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Difficulty } from "./difficulty.entity";

describe("DifficultyService", () => {
  let service: DifficultyService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({ delete: jest.fn().mockReturnThis(), execute: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DifficultyService,
        { provide: getRepositoryToken(Difficulty), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<DifficultyService>(DifficultyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
