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
}
