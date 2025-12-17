import { IsString, IsOptional, IsUUID, IsInt } from "class-validator";

export class ContainerDto {
  @IsString()
  name: string;

  @IsUUID()
  imageId: string;

  @IsOptional()
  @IsInt()
  statusId?: number | null;

  @IsOptional()
  @IsUUID()
  labId?: string | null;

  @IsOptional()
  @IsInt()
  userId?: number | null;
}
