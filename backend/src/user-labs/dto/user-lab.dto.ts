import { IsString, IsNumber, IsOptional, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";
import { getRepository } from "typeorm";
import { User } from "src/users/user.entity";
import { Lab } from "src/labs/lab.entity";
@ValidatorConstraint({ async: true })
export class UserExistsConstraint implements ValidatorConstraintInterface {
  async validate(userId: string, args: ValidationArguments) {
    if (!userId) return false;
    const user = await getRepository(User).findOne({ where: { id: userId } });
    return !!user;
  }
  defaultMessage(args: ValidationArguments) {
    return "User with id '$value' does not exist.";
  }
}
@ValidatorConstraint({ async: true })
export class LabExistsConstraint implements ValidatorConstraintInterface {
  async validate(labId: string, args: ValidationArguments) {
    if (!labId) return false;
    const lab = await getRepository(Lab).findOne({ where: { id: labId } });
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
  progress?: number;
  @IsNumber()
  @IsOptional()
  grade?: number;
}