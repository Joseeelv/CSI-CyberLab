import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlagSubmission } from './flag-submission.entity';
import { Lab } from 'src/labs/lab.entity';
import { User } from 'src/users/user.entity';

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
    return await this.flagSubmissionRepository.find();
  }

  async find(where: any): Promise<FlagSubmission[]> {
    return await this.flagSubmissionRepository.find({
      where,
      relations: ['user', 'lab'],
      order: { created: 'ASC' } // Orden cronológico para determinar flag1 y flag2
    });
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
      });

      if (!lab) {
        throw new NotFoundException(`Lab con UUID ${flagSubmissionData.labUuid} no encontrado`);
      }

      // 3. Comprobar si la bandera es correcta
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

      // Normalize flags (lowercase, trimmed) for safe comparison
      const normalizedValidFlags = validFlags.map((f) => f.trim().toLowerCase());
      const normalizedInputFlag = flagSubmissionData.flag.trim().toLowerCase();
      const isCorrect = normalizedValidFlags.includes(normalizedInputFlag);

      if (!isCorrect) {
        throw new BadRequestException('Flag incorrecto');
      }

      // 4. AISLAMIENTO: Verificar cuántas flags correctas ya tiene este usuario para este lab
      const existingCorrectSubmissions = await this.flagSubmissionRepository.find({
        where: {
          user: { id: user.id },
          lab: { uuid: lab.uuid },
          isCorrect: true,
        },
        order: { created: 'ASC' }
      });

      // Si ya tiene 2 flags correctas para este lab, no puede enviar más
      if (existingCorrectSubmissions.length >= 2) {
        throw new ConflictException('Ya has completado todas las flags de este laboratorio');
      }

      // 5. Verificar si esta flag específica ya fue enviada correctamente por este usuario en este lab
      const alreadySubmitted = existingCorrectSubmissions.some(
        submission => submission.name.trim().toLowerCase() === normalizedInputFlag
      );

      if (alreadySubmitted) {
        throw new ConflictException('Esta flag ya fue enviada correctamente anteriormente');
      }

      // 6. Crear y guardar la submission
      const newFlagSubmission = this.flagSubmissionRepository.create({
        user: user,
        lab: lab,
        name: flagSubmissionData.flag.trim(), // Guardar la flag original (no normalizada)
        isCorrect: isCorrect,
        created: new Date(),
      });

      const saved = await this.flagSubmissionRepository.save(newFlagSubmission);

      // Determinar si es la primera o segunda flag
      const flagNumber = existingCorrectSubmissions.length + 1;

      return {
        success: true,
        message: `¡Flag ${flagNumber} correcta! Bien hecho`,
        submission: saved,
        flagNumber: flagNumber,
        totalCorrect: flagNumber,
        isComplete: flagNumber === 2
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
    return this.flagSubmissionRepository.findOne({
      where: { id },
      relations: ['user', 'lab']
    });
  }

  async deleteFlagSubmission(id: number): Promise<String> {
    const submission = await this.findById(id);
    if (!submission) {
      throw new NotFoundException(`FlagSubmission with id ${id} not found`);
    }
    await this.flagSubmissionRepository.delete(id);
    return `FlagSubmission with id ${id} has been deleted`;
  }

  async deleteAllFlagSubmissions(): Promise<String> {
    await this.flagSubmissionRepository.clear();
    return `All FlagSubmissions have been deleted`;
  }

  async updateFlagSubmission(id: number, updateData: Partial<FlagSubmission>): Promise<FlagSubmission> {
    const existingSubmission = await this.findById(id);
    if (!existingSubmission) {
      throw new NotFoundException(`FlagSubmission with id ${id} not found`);
    }
    await this.flagSubmissionRepository.update(id, updateData);
    const updatedSubmission = await this.findById(id);
    if (!updatedSubmission) {
      throw new NotFoundException(`FlagSubmission with id ${id} not found after update`);
    }
    return updatedSubmission;
  }

  // Método auxiliar para obtener el progreso de un usuario en un lab
  async getUserLabProgress(userId: number, labUuid: string): Promise<{
    totalCorrect: number;
    flags: FlagSubmission[];
    isComplete: boolean;
  }> {
    const correctSubmissions = await this.flagSubmissionRepository.find({
      where: {
        user: { id: userId },
        lab: { uuid: labUuid },
        isCorrect: true,
      },
      order: { created: 'ASC' },
      relations: ['user', 'lab']
    });

    return {
      totalCorrect: correctSubmissions.length,
      flags: correctSubmissions,
      isComplete: correctSubmissions.length >= 2
    };
  }
}