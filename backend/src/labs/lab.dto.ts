import { IsString, IsBoolean, IsNumber } from "class-validator";

export class LabDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  status: boolean;

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
