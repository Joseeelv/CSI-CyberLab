import { BadRequestException, Injectable } from '@nestjs/common';
import { Image } from './image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Container } from 'src/containers/container.entity';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) { }

  async getImages() {
    return await this.imageRepository.find();
  }

  async createImage(imageData): Promise<Image> {
    if (!imageData?.name || typeof imageData.name !== 'string' || imageData.name.trim() === '') {
      throw new Error('Field "name" is required');
    }
    const image = {
      name: imageData.name.trim(),
      version: imageData.version,
      operatingSystemId: imageData.operatingSystemId,
      containerId: imageData.containerId,
    };
    try {
      return await this.imageRepository.save(image);
    } catch (error) {
      throw new BadRequestException('Failed to create image');
    }
  }
}