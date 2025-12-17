import { Test, TestingModule } from "@nestjs/testing";
import { FlagSubmissionController } from "./flag-submission.controller";
import { FlagSubmissionService } from "./flag-submission.service";
import { JwtService } from "@nestjs/jwt";

describe("FlagSubmissionController", () => {
  let controller: FlagSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagSubmissionController],
      providers: [
        { provide: FlagSubmissionService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<FlagSubmissionController>(FlagSubmissionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
