import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { MailingTemplate } from './mailing-template.entity';

@Injectable()
export class MailingTemplatesCrudService extends TypeOrmCrudService<MailingTemplate> {
  constructor(
    @InjectRepository(MailingTemplate)
    public repo: Repository<MailingTemplate>,
  ) {
    super(repo)
  }
}
