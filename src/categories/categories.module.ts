import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { IsCategoryExists } from './validators';
import { CategoriesCrudService } from './categories-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesCrudService, CategoriesService, IsCategoryExists],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
