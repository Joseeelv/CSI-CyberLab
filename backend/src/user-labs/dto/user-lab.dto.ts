import { UserExistsConstraint } from "./user-exists.validator";
import { LabExistsConstraint } from "./lab-exists.validator";
import { IsString, IsNumber, IsOptional, Validate, Min, Max } from "class-validator";


export class UserLabDto {
  @IsNumber()
  @IsOptional()
  @Validate(UserExistsConstraint)
  userId: number;

  @IsString()
  @IsOptional()
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