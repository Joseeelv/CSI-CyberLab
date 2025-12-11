import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>) { }
  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }
}
