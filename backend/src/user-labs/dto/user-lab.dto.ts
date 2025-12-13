import { IsString, IsNumber, IsOptional } from "class-validator";

export class UserLabDto {
  @IsString()
  userId: string;

  @IsString()
  labId: string;

  @IsNumber()
  @IsOptional()
  progress?: number;

  @IsNumber()
  @IsOptional()
  grade?: number;
}