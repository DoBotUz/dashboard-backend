import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private organizationModel: typeof Organization,
  ) {}

  async createNew(data: any): Promise<Organization> {
    data.status = this.organizationModel.STATUSES.ACTIVE;
    return await this.organizationModel.create(data);
  }

  async findOne(id: number): Promise<Organization> {
    return this.organizationModel.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Organization> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }
}
