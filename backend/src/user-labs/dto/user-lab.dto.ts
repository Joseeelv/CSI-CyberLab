import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/user.entity";
import { Lab } from "src/labs/lab.entity";
import { IsString, IsNumber, IsOptional, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, Min, Max } from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true })
export class UserExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async validate(userId: string, args: ValidationArguments) {
    if (!userId) return false;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return "User with id '$value' does not exist.";
  }
}

@Injectable()
@ValidatorConstraint({ async: true })
export class LabExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>
  ) { }

  async validate(labId: string, args: ValidationArguments) {
    if (!labId) return false;
    const lab = await this.labRepository.findOne({ where: { uuid: labId } });
    return !!lab;
  }

  defaultMessage(args: ValidationArguments) {
    return "Lab with id '$value' does not exist.";
  }
}

export class UserLabDto {
  @IsNumber()
  @Validate(UserExistsConstraint)
  userId: number;

  @IsString()
  @Validate(LabExistsConstraint)
  labId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  grade?: number;
}