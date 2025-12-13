import { UserExistsConstraint } from "./user-exists.validator";
import { LabExistsConstraint } from "./lab-exists.validator";
import { IsString, IsNumber, IsOptional, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, Min, Max } from "class-validator";


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