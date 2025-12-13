import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLab } from './user-lab.entity';

@Injectable()
export class UserLabService {
  constructor(
    @InjectRepository(UserLab)
    private readonly userLabRepository: Repository<UserLab>,
  ) {}

  async findAll(): Promise<UserLab[]> {
    return this.userLabRepository.find({ relations: ['user', 'lab'] });
  }

  async findOne(id: number): Promise<UserLab> {
    return this.userLabRepository.findOne({ where: { id }, relations: ['user', 'lab'] });
  }

  async create(userLab: Partial<UserLab>): Promise<UserLab> {
    const newUserLab = this.userLabRepository.create(userLab);
    return this.userLabRepository.save(newUserLab);
  }

  async update(id: number, userLab: Partial<UserLab>): Promise<UserLab> {
    await this.userLabRepository.update(id, userLab);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.userLabRepository.delete(id);
  }
}