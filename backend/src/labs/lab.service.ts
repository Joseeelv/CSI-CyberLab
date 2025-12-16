import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Lab } from './lab.entity';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { log } from 'console';

@Injectable()
export class LabService {
  private readonly logger = new Logger(LabService.name);

  constructor(
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>,
  ) { }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.labRepository.findAndCount({
      relations: ['categories', 'operatingSystem', 'difficulty', 'status'],
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(name: string): Promise<Lab> {
    const lab = await this.labRepository.findOne({
      where: { name } as FindOptionsWhere<Lab>,
      relations: [
        'categories',
        'operatingSystem',
        'difficulty',
        'status',
        'containers',
      ],
    });

    if (!lab) {
      throw new NotFoundException(`Lab with name ${name} not found`);
    }

    return lab;
  }

  async create(createLabDto: CreateLabDto): Promise<Lab> {
    try {
      const lab = {
        name: createLabDto.name,
        description: createLabDto.description,
        categoryId: createLabDto.categoryId,
        operatingSystemId: createLabDto.operatingSystemId,
        difficultyId: createLabDto.difficultyId,
        statusId: 1, // Default: inactive
        containerId: createLabDto.containerId,
      };

      const savedLab = await this.labRepository.save(lab);
      this.logger.log(`Lab created: ${savedLab.uuid}`);

      return savedLab;
    } catch (error) {
      this.logger.error(`Failed to create lab: ${error.message}`);
      throw new BadRequestException('Failed to create lab');
    }
  }

  async update(name: string, updateLabDto: UpdateLabDto): Promise<Lab> {
    const lab = await this.findOne(name);

    Object.assign(lab, updateLabDto);

    try {
      const updatedLab = await this.labRepository.save(lab);
      this.logger.log(`Lab updated: ${name}`);
      return updatedLab;
    } catch (error) {
      this.logger.error(`Failed to update lab ${name}: ${error.message}`);
      throw new BadRequestException('Failed to update lab');
    }
  }

  async remove(name: string): Promise<void> {
    try {
      const result = await this.labRepository.delete(name);

      if (result.affected === 0) {
        throw new NotFoundException(`Lab with name ${name} not found`);
      }

      this.logger.log(`Lab deleted: ${name}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete lab ${name}: ${error.message}`);
      throw new BadRequestException('Failed to delete lab');
    }
  }

  async removeAll(): Promise<void> {
    try {
      await this.labRepository.deleteAll();
      this.logger.log('All labs deleted');
    } catch (error) {
      this.logger.error(`Failed to delete all labs: ${error.message}`);
      throw new BadRequestException('Failed to delete all labs');
    }
  }
}
