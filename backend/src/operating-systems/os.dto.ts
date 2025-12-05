import { IsString } from 'class-validator';

export class OsDto {
  @IsString()
  name: string;
}