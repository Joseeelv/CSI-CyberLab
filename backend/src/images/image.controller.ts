import { Controller, Body, Get, Post } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from './image.entity';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get()
  async getImages() {
    return await this.imageService.getImages();
  }

  @Post()
  async createImage(@Body() imageData: Partial<Image>): Promise<Image> {
    return await this.imageService.createImage(imageData);
  }

}
