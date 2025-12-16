import { Test, TestingModule } from "@nestjs/testing";
import { FlagSubmissionService } from "./flag-submission.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FlagSubmission } from "./flag-submission.entity";
import { UserLab } from "../user-lab/user-lab.entity";

describe("FlagSubmissionService", () => {
  let service: FlagSubmissionService;

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
        FlagSubmissionService,
        {
          provide: getRepositoryToken(FlagSubmission),
          useValue: mockRepository,
        },
        { provide: getRepositoryToken(UserLab), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<FlagSubmissionService>(FlagSubmissionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
