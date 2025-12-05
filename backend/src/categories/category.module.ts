import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';

@Module({
  controllers: [CategoriesController]
})
export class CategoryModule {}
