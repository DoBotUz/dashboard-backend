import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Branch } from './branch.entity';

@Injectable()
export class BranchesCrudService extends TypeOrmCrudService<Branch> {
  constructor(
    @InjectRepository(Branch)
    public repo: Repository<Branch>,
  ) {
    super(repo)
  }
}
