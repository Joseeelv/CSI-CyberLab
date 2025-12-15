import { Test, TestingModule } from "@nestjs/testing";
import { DifficultiesController } from "./difficulty.controller";
import { DifficultyService } from "./difficulty.service";
import { JwtService } from "@nestjs/jwt";

describe("DifficultiesController", () => {
  let controller: DifficultiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DifficultiesController],
      providers: [
        { provide: DifficultyService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<DifficultiesController>(DifficultiesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
