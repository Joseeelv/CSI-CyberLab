import { Injectable, ConflictException } from "@nestjs/common";
import { Image } from "./image.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class ImageService {
    async createImage(imageData: Partial<Image>): Promise<Image> {
      // Validación básica, puedes expandir según tus necesidades
      if (!imageData.name) {
        throw new ConflictException('El nombre de la imagen es obligatorio');
      }
      const image = this.imageRepository.create(imageData);
      return await this.imageRepository.save(image);
    }
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async getImages() {
    const images = await this.imageRepository.find();
    return images.map((i) => instanceToPlain(i));
  }
}
