import { Test, TestingModule } from "@nestjs/testing";
import { ImageService } from "./image.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Image } from "./image.entity";

describe("ImageService", () => {
  let service: ImageService;

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
        ImageService,
        { provide: getRepositoryToken(Image), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
