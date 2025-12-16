import { IsString, IsBoolean, IsNumber } from "class-validator";

export class LabDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  status: number;

  @IsNumber()
  points: number;

  @IsNumber()
  estimatedTime: number;
  
  tags: string[];
  
  @IsNumber()
  categoryId: number;
  @IsNumber()
  operatingSystemId: number;
  @IsNumber()
  difficultyId: number;
  @IsNumber()
  containerId: number;
  @IsNumber()
  userId: number;
}
