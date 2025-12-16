import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Difficulty } from './difficulty.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';

type CreateDifficultyDto = Partial<Pick<Difficulty, 'name'>>;

@Injectable()
export class DifficultyService {

  constructor(
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
  ) { }

  async getAll(): Promise<any[]> {
    const difficulties = await this.difficultyRepository.find();
    // Oculta los IDs usando class-transformer
    return difficulties.map(d => instanceToPlain(d));
  }

  async create(data: CreateDifficultyDto): Promise<Difficulty> {
    const difficulty = this.difficultyRepository.create(data);
    try {
      return await this.difficultyRepository.save(difficulty);
    } catch (err: any) {
      // Manejo básico de errores: conflict si ya existe por clave única, else 500
      if (err?.code === '23505' /* unique_violation Postgres */) {
        throw new ConflictException('Difficulty already exists');
      }
      throw new InternalServerErrorException('Failed to create difficulty');
    }
  }

  async findByName(name: string): Promise<Difficulty | null> {
    return await this.difficultyRepository.findOne({ where: { name } });
  }
}
