import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get()
  async getImages() {
    return await this.imageService.getImages();
  }

}
