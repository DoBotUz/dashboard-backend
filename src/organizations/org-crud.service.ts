import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Organization } from './organization.entity';

@Injectable()
export class OrgCrudService extends TypeOrmCrudService<Organization> {
  constructor(
    @InjectRepository(Organization)
    public organizationsRepository: Repository<Organization>,
  ) {
    super(organizationsRepository)
  }
}
