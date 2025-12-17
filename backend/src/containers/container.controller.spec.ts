import { Test, TestingModule } from "@nestjs/testing";
import { ContainerController } from "./container.controller";
import { ContainerService } from "./container.service";
import { JwtService } from "@nestjs/jwt";

describe("ContainerController", () => {
  let controller: ContainerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContainerController],
      providers: [
        { provide: ContainerService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ContainerController>(ContainerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
