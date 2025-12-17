import { Test, TestingModule } from "@nestjs/testing";
import { LabController } from "./lab.controller";
import { LabService } from "./lab.service";
import { JwtService } from "@nestjs/jwt";

describe("LabController", () => {
  let controller: LabController;

  beforeEach(async () => {
    const mockLabService = {
      getAllLabs: jest.fn(),
      createLab: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeAll: jest.fn(),
    };

    const mockJwtService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabController],
      providers: [
        { provide: LabService, useValue: mockLabService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<LabController>(LabController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
