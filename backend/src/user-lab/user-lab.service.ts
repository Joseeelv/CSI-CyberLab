import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserLab } from "./user-lab.entity";
import { UserLabDto } from "./dto/user-lab.dto";

@Injectable()
export class UserLabService {
  constructor(
    @InjectRepository(UserLab)
    private readonly userLabRepository: Repository<UserLab>,
  ) {}

  async findAll(): Promise<UserLab[]> {
    return this.userLabRepository.find({ relations: ["user", "lab"] });
  }

  async findOne(id: number): Promise<UserLab> {
    const userLab = await this.userLabRepository.findOne({
      where: { id },
      relations: ["user", "lab"],
    });
    if (!userLab) {
      throw new NotFoundException(`UserLab with id ${id} does not exist`);
    }
    return userLab;
  }

  async create(userLab: UserLabDto): Promise<UserLab> {

    const existingUserLab = await this.userLabRepository.findOne({ where: { user: { id: userLab.userId }, lab: { uuid: userLab.labId } } });
    if (existingUserLab) {
      throw new ConflictException(`UserLab for userId ${userLab.userId} and labId ${userLab.labId} already exists`);

    try {
      const existingUserLab = await this.userLabRepository.findOne({ where: { user: { id: userLab.userId }, lab: { uuid: userLab.labId } } });
      if (existingUserLab) {
        throw new ConflictException(`UserLab for userId ${userLab.userId} and labId ${userLab.labId} already exists`);
      }
      const newUserLab = this.userLabRepository.create({
        ...userLab,
        labId: parseInt(userLab.labId, 10),
      });
      return this.userLabRepository.save(newUserLab);
    } catch (error) {
      throw error;
    }
    const newUserLab = this.userLabRepository.create({
      ...userLab,
      labId: userLab.labId,
    // Verificar si ya existe un UserLab para este usuario y lab
    console.log("Creando UserLab con datos:", userLab);
    const existingUserLab = await this.userLabRepository.findOne({
      where: {
        userId: userLab.userId,
        labId: userLab.labUuid
      },
    });

    if (existingUserLab) {
      throw new ConflictException(
        `UserLab for userId ${userLab.userId} and labId ${userLab.labUuid} already exists`,
      );
    }

    // Crear el nuevo UserLab con los campos correctos
    const newUserLab = this.userLabRepository.create({
      userId: userLab.userId,
      labId: userLab.labUuid,
      progress: 0,
      score: 0,
      isFinished: false,
      started: new Date(),
    });

    return this.userLabRepository.save(newUserLab);
  }

  async update(id: number, userLab: Partial<UserLab>): Promise<UserLab> {
    const existingUserLab = await this.userLabRepository.findOne({
      where: { id },
    });
    if (!existingUserLab) {
      throw new NotFoundException(`UserLab with id ${id} does not exist`);
    }
    const updatedUserLab = Object.assign(existingUserLab, userLab);
    return this.userLabRepository.save(updatedUserLab);
  }

  async delete(id: number): Promise<void> {
    const userLab = await this.userLabRepository.findOne({ where: { id } });
    if (!userLab) {
      throw new NotFoundException(`UserLab with id ${id} does not exist`);
    }
    await this.userLabRepository.delete(id);
  }
}
