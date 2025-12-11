import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Lab } from './lab.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LabDto } from './lab.dto';

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
    
    const lab = this.labRepository.create({
      name: labData.name.trim(),
      description: labData.description,
      points: labData.points,
      estimatedTime: labData.estimatedTime,
      tags: labData.tags,
      status: { id: 1 } as any,
      operatingSystem: { id: labData.operatingSystemId } as any,
      difficulty: { id: labData.difficultyId } as any,
    });

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

  async findByName(name: string): Promise<Lab> {
    const lab = await this.labRepository.findOne({
      where: { name },
      relations: ['category', 'operatingSystem', 'difficulty', 'container', 'status']
    });

    if (!lab) {
      throw new NotFoundException(`Lab with name "${name}" not found`);
    }

    return lab;
  }

  async create(createLabDto: LabDto): Promise<Lab> {
    const lab = this.labRepository.create({
      name: createLabDto.name,
      description: createLabDto.description,
      points: createLabDto.points,
      estimatedTime: createLabDto.estimatedTime,
      tags: createLabDto.tags,
      status: { id: 1 } as any, //por defecto inactivo
      operatingSystem: { id: createLabDto.operatingSystemId } as any,
      difficulty: { id: createLabDto.difficultyId } as any,
    });
    
    return await this.labRepository.save(lab);
  }

  async update(name: string, updateLabDto: LabDto): Promise<Lab> {
    const lab = await this.findByName(name);
    Object.assign(lab, updateLabDto);
    return await this.labRepository.save(lab);
  }

  async remove(name: string): Promise<void> {
    const lab = await this.findByName(name);
    await this.labRepository.remove(lab);
  }

  async removeAll(): Promise<void> {
    await this.labRepository.clear();
  }
}