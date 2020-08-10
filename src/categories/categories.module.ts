import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { IsCategoryExists } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService, IsCategoryExists],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
