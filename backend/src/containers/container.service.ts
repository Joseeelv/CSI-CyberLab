import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createContainer(containerData): Promise<Container> {
    const newContainer = {
      name: containerData.name?.trim(),
      imageId: Number(containerData.image),
      labId: Number(containerData.lab),
      statusId: 1, // Default -> inactive
      userId: Number(containerData.user),
      created: new Date()
    };
    try {
      return await this.containerRepository.save(newContainer);
    } catch (e) {
      throw new BadRequestException('Failed to create container');
    }

  }
}
