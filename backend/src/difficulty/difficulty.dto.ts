import { IsString } from 'class-validator';

export class DifficultyDto {
  @IsString()
  name: string;
}