import { Injectable } from '@nestjs/common';
import { Status } from './status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) { }

  async getAllStatuses(): Promise<Status[]> {
    return await this.statusRepository.find();
  }

  async createStatus(statusData: Partial<Status>): Promise<Status> {
    const status = this.statusRepository.create(statusData);
    return await this.statusRepository.save(status);
  }
}
