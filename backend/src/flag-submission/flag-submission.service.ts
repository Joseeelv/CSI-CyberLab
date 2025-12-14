import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagSubmission } from "./flag-submission.entity";
import { UserLab } from "src/user-lab/user-lab.entity";

@Injectable()
export class FlagSubmissionService {
  constructor(
    @InjectRepository(FlagSubmission)
    private flagSubmissionRepository: Repository<FlagSubmission>,
    @InjectRepository(UserLab)
    private userLabRepository: Repository<UserLab>,
  ) {}

  async getAllFlagSubmissions(): Promise<FlagSubmission[]> {
    return await this.flagSubmissionRepository.find();
  }

  async find(): Promise<FlagSubmission[]> {
    // Corregir el nombre de la relación: userLab (camelCase)
    return await this.flagSubmissionRepository.find({
      where: { isCorrect: true },
      relations: ["userLab"],
      order: { created: "ASC" },
    });
  }

  async SubmitFlag(flagSubmissionData: {
    labUuid: string;
    flag: string;
    userId: string;
  }): Promise<any> {
    try {
      // 1. Buscar el UserLab por userId y labUuid
      const userLab = await this.userLabRepository.findOne({
        where: {
          labId: flagSubmissionData.labUuid,
          userId: flagSubmissionData.userId,
        },
        relations: ["lab"],
      });

      if (!userLab || !userLab.lab) {
        throw new NotFoundException(
          `Lab con UUID ${flagSubmissionData.labUuid} no encontrado para este usuario`,
        );
      }

      const lab = userLab.lab;

      // 3. Comprobar si la bandera es correcta
      if (!lab.flag) {
        throw new BadRequestException(
          "Este laboratorio no tiene flags configuradas",
        );
      }

      // Manejar correctamente el array de flags
      let validFlags: string[];
      if (Array.isArray(lab.flag)) {
        validFlags = lab.flag;
      } else {
        validFlags = [lab.flag];
      }

      // Normalize flags (lowercase, trimmed) for safe comparison
      const normalizedValidFlags = validFlags.map((f) =>
        f.trim().toLowerCase(),
      );
      const normalizedInputFlag = flagSubmissionData.flag.trim().toLowerCase();
      const isCorrect = normalizedValidFlags.includes(normalizedInputFlag);

      if (!isCorrect) {
        throw new BadRequestException("Flag incorrecto");
      }

      // 4. AISLAMIENTO: Verificar cuántas flags correctas ya tiene este usuario para este lab
      const existingCorrectSubmissions =
        await this.flagSubmissionRepository.find({
          where: {
            userLabId: userLab.id,
            labId: lab.uuid,
            isCorrect: true,
          },
          order: { created: "ASC" },
        });

      // Si ya tiene 2 flags correctas para este lab, no puede enviar más
      if (existingCorrectSubmissions.length >= 2) {
        throw new ConflictException(
          "Ya has completado todas las flags de este laboratorio",
        );
      }

      // 5. Verificar si esta flag específica ya fue enviada correctamente por este usuario en este lab
      const alreadySubmitted = existingCorrectSubmissions.some(
        (submission) =>
          submission.name.trim().toLowerCase() === normalizedInputFlag,
      );

      if (alreadySubmitted) {
        throw new ConflictException(
          "Esta flag ya fue enviada correctamente anteriormente",
        );
      }

      // 6. Crear y guardar la submission
      const newFlagSubmission = this.flagSubmissionRepository.create({
        userLabId: userLab.id,
        labId: lab.uuid,
        name: flagSubmissionData.flag.trim(),
        isCorrect: isCorrect,
        created: new Date(),
      });

      //7. Almacenamos el progreso del usuario en el lab (flag correcta)
      // Determinar el índice de la flag enviada
      let flagIndex = normalizedValidFlags.findIndex(
        (f) => f === normalizedInputFlag,
      );
      if (flagIndex === -1) flagIndex = 0;
      let score = 0;
      const anyLab = lab as any;
      if (Array.isArray(anyLab.scorePerFlag)) {
        score = anyLab.scorePerFlag[flagIndex] || 0;
      } else if (typeof anyLab.scorePerFlag === "number") {
        score = anyLab.scorePerFlag;
      } else if (typeof lab.points === "number" && validFlags.length === 2) {
        score =
          flagIndex === 0
            ? Math.round(lab.points * 0.4)
            : Math.round(lab.points * 0.6);
      } else if (typeof lab.points === "number") {
        score += lab.points;
      }

      // Actualizar progreso y score en el UserLab existente
      userLab.progress = existingCorrectSubmissions.length + 1;
      userLab.score = score;

      // Si el usuario ha completado todas las flags, marcar como finalizado
      const flagNumber = existingCorrectSubmissions.length + 1;
      if (flagNumber === validFlags.length) {
        userLab.isFinished = true;
      }
      await this.userLabRepository.save(userLab);

      const saved = await this.flagSubmissionRepository.save(newFlagSubmission);

      // Determinar si es la primera o segunda flag
      const flagNumber = existingCorrectSubmissions.length + 1;

      return {
        success: true,
        message: `¡Flag ${flagNumber} correcta! Bien hecho`,
        submission: saved,
        flagNumber: flagNumber,
        totalCorrect: flagNumber,
        isComplete: flagNumber === validFlags.length,
      };
    } catch (error) {
      console.error("Error en SubmitFlag:", error);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        "Error al procesar la flag: " + error.message,
      );
    }
  }

  async findById(id: number): Promise<FlagSubmission | null> {
    return this.flagSubmissionRepository.findOne({
      where: { id },
      relations: ["userLab"],
    });
  }

  async deleteFlagSubmission(id: number): Promise<string> {
    const submission = await this.findById(id);
    if (!submission) {
      throw new NotFoundException(`FlagSubmission with id ${id} not found`);
    }
    await this.flagSubmissionRepository.delete(id);
    return `FlagSubmission with id ${id} has been deleted`;
  }

  async deleteAllFlagSubmissions(): Promise<string> {
    await this.flagSubmissionRepository.clear();
    return `All FlagSubmissions have been deleted`;
  }

  async updateFlagSubmission(
    id: number,
    updateData: Partial<FlagSubmission>,
  ): Promise<FlagSubmission> {
    const existingSubmission = await this.findById(id);
    if (!existingSubmission) {
      throw new NotFoundException(`FlagSubmission with id ${id} not found`);
    }
    await this.flagSubmissionRepository.update(id, updateData);
    const updatedSubmission = await this.findById(id);
    if (!updatedSubmission) {
      throw new NotFoundException(
        `FlagSubmission with id ${id} not found after update`,
      );
    }
    return updatedSubmission;
  }

  async getUserLabProgress(
    userId: string,
    labUuid: string,
  ): Promise<{
    totalCorrect: number;
    flags: FlagSubmission[];
    isComplete: boolean;
  }> {
    const userLab = await this.userLabRepository.findOne({
      where: { userId, labId: labUuid },
    });
    if (!userLab) {
      return { totalCorrect: 0, flags: [], isComplete: false };
    }
    const correctSubmissions = await this.flagSubmissionRepository.find({
      where: {
        userLabId: userLab.id,
        labId: labUuid,
        isCorrect: true,
      },
      order: { created: "ASC" },
      relations: ["userLab"],
    });
    return {
      totalCorrect: correctSubmissions.length,
      flags: correctSubmissions,
      isComplete: correctSubmissions.length >= 2,
    };
  }
}
