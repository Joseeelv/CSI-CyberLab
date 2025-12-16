import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule { }
