import { IsString } from "class-validator";

export class ContainerDto {
  @IsString()
  name: string;

  @IsString()
  imageId: string;

  @IsString()
  statusId: string;
}