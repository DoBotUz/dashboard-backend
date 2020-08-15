import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, STATUSES } from './organization.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  async createNew(data: any): Promise<Organization> {
    data.status = STATUSES.ACTIVE;
    const organization = new Organization();
    Object.assign(organization, data);
    return await this.organizationsRepository.save(organization);
  }

  async findOne(id: number): Promise<Organization> {
    return this.organizationsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Organization> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.organizationsRepository.save(model);
  }
}
