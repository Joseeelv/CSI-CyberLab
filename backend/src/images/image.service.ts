import { Injectable, ConflictException } from "@nestjs/common";
import { Image } from "./image.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async getImages() {
    const images = await this.imageRepository.find();
    return images.map((i) => instanceToPlain(i));
  }

  async createImage(imageData: Partial<Image>): Promise<Image> {
    if (!imageData.name || !imageData.tag) {
      throw new ConflictException(
        "El nombre y la versión de la imagen son obligatorios",
      );
    }

    const existingImage = await this.imageRepository.findOne({
      where: { name: imageData.name, tag: imageData.tag },
    });
    if (existingImage) {
      throw new ConflictException(
        `La imagen con nombre ${imageData.name} y versión ${imageData.tag} ya existe`,
      );
    }

    const image = this.imageRepository.create(imageData);
    return await this.imageRepository.save(image);
  }

  async createImage(imageData: Partial<Image>): Promise<Image> {
    if (!imageData.name || !imageData.tag) {
      throw new ConflictException("El nombre y la versión de la imagen son obligatorios");
    }

    const existingImage = await this.imageRepository.findOne({ where: { name: imageData.name, tag: imageData.tag } });
    if (existingImage) {
      throw new ConflictException(`La imagen con nombre ${imageData.name} y versión ${imageData.tag} ya existe`);
    }

    const image = this.imageRepository.create(imageData);
    return await this.imageRepository.save(image);
  }
}
