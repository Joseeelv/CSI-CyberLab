import { Test, TestingModule } from "@nestjs/testing";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { JwtService } from "@nestjs/jwt";

describe("ImageController", () => {
  let controller: ImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        { provide: ImageService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
