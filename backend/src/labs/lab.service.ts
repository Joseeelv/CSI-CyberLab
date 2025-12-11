import { Injectable, BadRequestException } from '@nestjs/common';
import { Lab } from './lab.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LabDto } from './lab.dto';
import { json } from 'stream/consumers';
@Injectable()
export class LabService {
  constructor(
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>,
  ) { }

  async getAllLabs() {
    return await this.labRepository.find({
      relations: ['difficulty', 'operatingSystem', 'categories'],
    });
  }

  async createLab(labData: LabDto): Promise<Lab> {
    if (!labData?.name || typeof labData.name !== 'string' || labData.name.trim() === '') {
      throw new BadRequestException('Field "name" is required');
    }
    const lab = {
      name: labData.name.trim(),
      description: labData.description,
      status: labData.status,
      points: labData.points,
      estimatedTime: labData.estimatedTime,
      tags: labData.tags,
      categoryId: Number(labData.categoryId),
      operatingSystemId: Number(labData.operatingSystemId),
      difficultyId: Number(labData.difficultyId),
      containerId: Number(labData.containerId),
    };

    try {
      return await this.labRepository.save(lab);
    } catch (error) {
      throw new BadRequestException('Failed to create lab');
    }

  }

  async findLabById(uuid: string): Promise<Lab | null> {
    return await this.labRepository.findOne({ where: { uuid } });
  }

  async updateLab(uuid: string, updateData: Partial<Lab>): Promise<Lab | null> {
    const lab = await this.labRepository.findOne({ where: { uuid } });
    if (!lab) {
      throw new Error('Lab not found');
    }
    Object.assign(lab, updateData);
    return await this.labRepository.save(lab);
  }

  async deleteLab(uuid: string): Promise<void> {
    const lab = await this.labRepository.findOne({ where: { uuid } });
    if (!lab) {
      throw new Error('Lab not found');
    }
    await this.labRepository.remove(lab);
  }
}
