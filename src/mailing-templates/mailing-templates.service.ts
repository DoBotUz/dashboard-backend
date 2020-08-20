import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailingTemplate, STATUSES } from '../mailing-templates/mailing-template.entity';


@Injectable()
export class MailingTemplatesService {
  constructor(
    @InjectRepository(MailingTemplate)
    private mailingTemplateRepository: Repository<MailingTemplate>,
  ) {}

  async findOne(id: number): Promise<MailingTemplate> {
    return this.mailingTemplateRepository.findOne({
      where: {
        id,
      },
      join: {
        alias: 'template',
        leftJoinAndSelect: {
          organization: 'template.organization',
          bot: 'organization.bot',
        }
      }
    });
  }
  
  async createNew(data: any): Promise<MailingTemplate> {
    const model = new MailingTemplate();
    Object.assign(model, data);
    return await this.mailingTemplateRepository.save(model);
  }

  async updateOne(id: number, data: any): Promise<MailingTemplate> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.mailingTemplateRepository.save(model);
  }

  async removeOne(id: number): Promise<boolean> {
    const model = await this.mailingTemplateRepository.findOne(id);
    this.mailingTemplateRepository.remove(model);
    return true;
  }

  async updateModel(model: MailingTemplate): Promise<MailingTemplate> {
    return this.mailingTemplateRepository.save(model);
  }
}
