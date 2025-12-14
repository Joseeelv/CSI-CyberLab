import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Lab } from './lab.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LabDto } from './dto/lab.dto';


type RawTags = string | string[] | undefined | null;

@Injectable()
export class LabService {
  constructor(
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>,
  ) { }

  async getAllLabs(): Promise<Lab[]> {
    return this.labRepository.find({
      relations: ['difficulty', 'operatingSystem', 'category', 'status', 'containers', 'flagSubmissions'],
    });
  }

  async findByName(name: string): Promise<Lab> {
    const lab = await this.labRepository.findOne({
      where: { name },
      relations: ['category', 'operatingSystem', 'difficulty', 'containers', 'status', 'flagSubmissions'],
    });

    if (!lab) {
      throw new NotFoundException(`Lab with name "${name}" not found`);
    }

    return lab;
  }

  async findById(uuid: string): Promise<Lab> {
    const lab = await this.labRepository.findOne({
      where: { uuid },
      relations: ['difficulty', 'operatingSystem', 'category', 'status', 'containers', 'flagSubmissions'],
    });

    if (!lab) {
      throw new NotFoundException(`Lab with uuid "${uuid}" not found`);
    }

    return lab;
  }

  async createLab(labData: LabDto): Promise<Lab> {
    if (!labData?.name || typeof labData.name !== 'string' || labData.name.trim() === '') {
      throw new BadRequestException('Field "name" is required');
    }

    const tags = this.parseTags(labData.tags as RawTags);

    const lab = this.labRepository.create({
      name: labData.name.trim(),
      description: labData.description,
      points: labData.points,
      flag: labData.flag,
      estimatedTime: labData.estimatedTime,
      tags,
      status: { id: 1 } as any,
      category: { id: labData.categoryId } as any,
      operatingSystem: { id: labData.operatingSystemId } as any,
      difficulty: { id: labData.difficultyId } as any,
    });

    try {
      const savedLab = await this.labRepository.save(lab);
      // Recargar con todas las relaciones
      return await this.findById(savedLab.uuid);
    } catch (error) {
      throw new BadRequestException('Failed to create lab');
    }
  }

  async update(identifier: string, updateData: Partial<LabDto>): Promise<Lab> {
    // Buscar por uuid o name
    const lab = await this.labRepository.findOne({
      where: [{ uuid: identifier }, { name: identifier }]
    });

    if (!lab) {
      throw new NotFoundException(`Lab with identifier "${identifier}" not found`);
    }

    // Parse tags si están presentes
    if ((updateData as any).tags) {
      lab.tags = this.parseTags((updateData as any).tags);
    }

    Object.assign(lab, updateData);

    const savedLab = await this.labRepository.save(lab);
    // Recargar con todas las relaciones
    return await this.findById(savedLab.uuid);
  }

  async remove(identifier: string): Promise<void> {
    const lab = await this.labRepository.findOne({
      where: [{ uuid: identifier }, { name: identifier }]
    });

    if (!lab) {
      throw new NotFoundException(`Lab with identifier "${identifier}" not found`);
    }

    await this.labRepository.remove(lab);
  }

  async removeAll(): Promise<void> {
    await this.labRepository.createQueryBuilder().delete().execute();
  }

  private parseTags(value: RawTags): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
      const cleaned = value.trim();
      try {
        // Intentar parsear JSON (con comillas simples o dobles)
        const json = cleaned.replace(/'/g, '"');
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      } catch {
        // Fallback: dividir por comas
        return cleaned
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((t) => t.replace(/^\s*["']\s*|\s*["']\s*$/g, '').trim())
          .filter(Boolean);
      }
    }
    return [];
  }
}