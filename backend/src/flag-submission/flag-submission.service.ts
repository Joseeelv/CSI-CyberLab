import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlagSubmission } from './flag-submission.entity';
import { Lab } from 'src/labs/lab.entity';
import { User } from 'src/users/user.entity'; // Asegúrate de importar User

@Injectable()
export class FlagSubmissionService {
  constructor(
    @InjectRepository(FlagSubmission)
    private flagSubmissionRepository: Repository<FlagSubmission>,
    @InjectRepository(Lab)
    private labRepository: Repository<Lab>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getAllFlagSubmissions(): Promise<FlagSubmission[]> {
    return this.flagSubmissionRepository.find();
  }

  async SubmitFlag(flagSubmissionData: {
    labUuid: string,
    flag: string,
    userId: number,
  }): Promise<any> {
    try {
      // 1. Buscar el usuario por id
      const user = await this.userRepository.findOne({
        where: { id: flagSubmissionData.userId }
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // 2. Verificar que el laboratorio exista
      const lab = await this.labRepository.findOne({
        where: { uuid: flagSubmissionData.labUuid },
        // NO uses select aquí, necesitamos todas las propiedades
      });

      if (!lab) {
        throw new NotFoundException(`Lab con UUID ${flagSubmissionData.labUuid} no encontrado`);
      }

      // 4. Comprobar si la bandera es correcta
      if (!lab.flag) {
        throw new BadRequestException('Este laboratorio no tiene flags configuradas');
      }

      // Manejar correctamente el array de flags
      let validFlags: string[];
      if (Array.isArray(lab.flag)) {
        validFlags = lab.flag;
      } else {
        validFlags = [lab.flag];
      }

      // Normalize flags (lowercase, trimmed) and input for a safe comparison
      const normalizedValidFlags = validFlags.map((f) => f.trim().toLowerCase());
      const isCorrect = normalizedValidFlags.includes(flagSubmissionData.flag.trim().toLowerCase());

      // Corregir la condición malformada
      if (!isCorrect) {
        throw new BadRequestException('Flag incorrecto');
      }

      // 5. Opcional: Verificar si ya existe una submission para este usuario y lab
      const existingSubmission = await this.flagSubmissionRepository.findOne({
        where: {
          userId: { id: user.id },
          labId: { uuid: lab.uuid },
        },
      });

      if (existingSubmission) {
        // Evitamos duplicados
        throw new ConflictException('Esta flag ya fue enviada anteriormente');
      }

      // 6. Crear y guardar la submission
      const newFlagSubmission = this.flagSubmissionRepository.create({
        userId: user,
        labId: lab,
        name: flagSubmissionData.flag,
        isCorrect: isCorrect,
        created: new Date(),
      });

      const saved = await this.flagSubmissionRepository.save(newFlagSubmission);

      return {
        success: true,
        message: '¡Flag correcta! Bien hecho 🎉',
        submission: saved,
      };
    } catch (error) {
      console.error('Error en SubmitFlag:', error);

      // Re-lanzar errores conocidos
      if (error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException) {
        throw error;
      }

      // Error genérico
      throw new BadRequestException('Error al procesar la flag: ' + error.message);
    }
  }

  async findById(id: number): Promise<FlagSubmission | null> {
    return this.flagSubmissionRepository.findOne({ where: { id } });
  }

  async deleteFlagSubmission(id: number): Promise<String> {
    await this.flagSubmissionRepository.delete(id);
    return `FlagSubmission with id ${id} has been deleted`;
  }

  async deñleteAllFlagSubmissions(): Promise<String> {
    await this.flagSubmissionRepository.clear();
    return `All FlagSubmissions have been deleted`;
  }

  async updateFlagSubmission(id: number, updateData: Partial<FlagSubmission>): Promise<FlagSubmission> {
    const updatedFlagSubmission = await this.findById(id);
    if (!updatedFlagSubmission) {
      throw new Error(`FlagSubmission with id ${id} not found`);
    }
    await this.flagSubmissionRepository.update(id, updateData);
    return updatedFlagSubmission;
  }
}