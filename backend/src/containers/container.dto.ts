import { IsString } from "class-validator";

export class ContainerDto {
  @IsString()
  name: string;

  @IsString()
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
