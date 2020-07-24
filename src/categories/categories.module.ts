import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { IsCategoryExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  providers: [CategoriesService, IsCategoryExists],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
