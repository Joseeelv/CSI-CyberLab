import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
