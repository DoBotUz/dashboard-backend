import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Organization, STATUSES } from './organization.entity';

@Injectable()
export class OrganizationsService extends TypeOrmCrudService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {
    super(organizationsRepository);
  }

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

  async listAllUsers(user_id: number): Promise<Organization[]> {
    return this.organizationsRepository.find({
      where: {
        user_id
      },
    });
  }
  
  async findOneUsersById(user_id: number, id: number): Promise<Organization> {
    return this.organizationsRepository.findOne({
      where: {
        user_id,
        id
      },
    });
  }
}
