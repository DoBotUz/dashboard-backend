import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Category } from './category.entity';

@Injectable()
export class CategoriesCrudService extends TypeOrmCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    public repo: Repository<Category>,
  ) {
    super(repo)
  }
}
