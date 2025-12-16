import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lab } from "src/labs/lab.entity";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true })
export class LabExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>,
  ) {}

  async validate(labId: string) {
    if (!labId) return false;
    const lab = await this.labRepository.findOne({ where: { uuid: labId } });
    return !!lab;
  }

  defaultMessage() {
    return "Lab with id '$value' does not exist.";
  }
}
