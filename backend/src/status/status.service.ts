import { Injectable } from "@nestjs/common";
import { Status } from "./status.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async getAllStatuses(): Promise<any[]> {
    const statuses = await this.statusRepository.find();
    return statuses.map((s) => instanceToPlain(s));
  }

  async createStatus(statusData: Partial<Status>): Promise<Status> {
    const status = this.statusRepository.create(statusData);
    return await this.statusRepository.save(status);
  }

  async findByName(name: string): Promise<Status | null> {
    return await this.statusRepository.findOne({ where: { name } });
  }
}
