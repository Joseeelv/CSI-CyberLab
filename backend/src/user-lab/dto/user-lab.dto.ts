import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from "class-validator";

export class UserLabDto {
  @IsString()
  userId: string;

  @IsString()
  labUuid: string;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsBoolean()
  isFinished?: boolean;

  @IsOptional()
  @IsDateString()
  started?: string;
}
