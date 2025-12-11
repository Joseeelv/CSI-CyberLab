import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Difficulty } from 'src/difficulty/difficulty.entity';
import { Status } from 'src/status/status.entity';
import { Container } from 'src/containers/container.entity';
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
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(OperatingSystem)
    private readonly osRepository: Repository<OperatingSystem>,
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
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
      // Resolve relations
      const category = await this.categoryRepository.findOne({ where: { id: createLabDto.categoryId } });
      if (!category) throw new BadRequestException('Category not found');

      const os = await this.osRepository.findOne({ where: { id: createLabDto.operatingSystemId } });
      if (!os) throw new BadRequestException('Operating system not found');

      const difficulty = await this.difficultyRepository.findOne({ where: { id: createLabDto.difficultyId } });
      if (!difficulty) throw new BadRequestException('Difficulty not found');

      const status = await this.statusRepository.findOne({ where: { id: 1 } });
      if (!status) throw new BadRequestException('Default status not found');

      const labEntity: Partial<Lab> = this.labRepository.create({
        name: createLabDto.name,
        description: createLabDto.description,
        categories: [{ id: category.id } as Category],
        operatingSystem: { id: os.id } as OperatingSystem,
        difficulty: { id: difficulty.id } as Difficulty,
        status: { id: status.id } as Status,
      });

      const savedLab = await this.labRepository.save(labEntity as Lab);
      this.logger.log(`Lab created: ${savedLab.uuid}`);

      // Attach container to lab if containerId provided
      if (createLabDto.containerId) {
        const container = await this.containerRepository.findOne({ where: { id: createLabDto.containerId } });
        if (!container) throw new BadRequestException('Container not found');
        container.lab = savedLab;
        await this.containerRepository.save(container);
      }

      // ensure many-to-many categories relation is created even in edge cases
      try {
        await this.labRepository.createQueryBuilder()
          .relation(Lab, 'categories')
          .of(savedLab)
          .add(category.id);
      } catch (e) {
        // non fatal - continue
        this.logger.warn('Failed to attach category via relation builder: ' + e.message);
      }

      // Return lab with relations
      const created = await this.labRepository.findOne({
        where: { uuid: savedLab.uuid } as FindOptionsWhere<Lab>,
        relations: ['categories', 'operatingSystem', 'difficulty', 'status', 'containers'],
      });

      if (!created) throw new NotFoundException('Failed to load created lab');
      return created;
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
      await this.labRepository.manager.transaction(async (manager) => {
        await manager
          .getRepository(Container)
          .createQueryBuilder()
          .update(Container)
          .set({ lab: undefined })
          .where('"labId" IS NOT NULL')
          .execute();
          
        await manager.createQueryBuilder().delete().from('user_labs_lab').execute();
        await manager.createQueryBuilder().delete().from('lab_users_user').execute();
        await manager.createQueryBuilder().delete().from('lab_categories_category').execute();
        await manager.getRepository(Lab).createQueryBuilder().delete().execute();
      });

      this.logger.log('All labs deleted');
    } catch (error) {
      this.logger.error(`Failed to delete all labs: ${error.message}`);
      throw new BadRequestException('Failed to delete all labs');
    }
  }
}
