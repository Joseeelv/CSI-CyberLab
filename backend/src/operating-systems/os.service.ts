import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OperatingSystem } from "./os.entity";
import { OsDto } from "./os.dto";
@Injectable()
export class OperatingSystemsService {
  constructor(
    @InjectRepository(OperatingSystem)
    private readonly osRepository: Repository<OperatingSystem>,
  ) {}
  async getAll(): Promise<OperatingSystem[]> {
    return await this.osRepository.find();
  }

  async createOS(data: OsDto) {
    if (!data.name) {
      throw new Error("Name is required");
    }
    const os = this.osRepository.create(data);
    return await this.osRepository.save(os);
  }
}
