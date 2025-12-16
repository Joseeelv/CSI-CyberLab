import { Controller, Get, Post, Body } from '@nestjs/common';
import { ImageService } from './image.service';
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get()
  async getImages() {
    return await this.imageService.getImages();
  }

  @Post()
  async createImage(@Body() imageData) {
    return await this.imageService.createImage(imageData);
  }

}
