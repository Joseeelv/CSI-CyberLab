import { IsString, IsNumber, IsOptional } from "class-validator";

export class LabDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  estimatedTime?: number;

  @IsOptional()
  tags?: string | string[];

  @IsOptional()
  flag?: string[];

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  operatingSystemId?: number;

  @IsNumber()
  @IsOptional()
  difficultyId?: number;

  @IsNumber()
  @IsOptional()
  containerId?: number;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
