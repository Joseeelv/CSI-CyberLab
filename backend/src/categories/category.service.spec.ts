import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Category } from "./category.entity";

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(async () => {
    const mockCategoryRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({ delete: jest.fn().mockReturnThis(), execute: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
