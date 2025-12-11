import { Injectable } from '@nestjs/common';
import { Image } from './image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) { }

  async getImages() {
    return await this.imageRepository.find();
  }
}
