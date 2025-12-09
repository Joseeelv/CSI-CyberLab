import { Injectable } from '@nestjs/common';
import { Container } from './container.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ContainerService {
  constructor(
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
  ) { }

  async getContainers() {
    return await this.containerRepository.find();
  }
}
