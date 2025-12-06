import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateLabDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  categoryId: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  operatingSystemId: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  difficultyId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  containerId?: number;
}
