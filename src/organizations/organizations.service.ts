import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './organization.entity';
import { User } from 'src/users/user.entity';
import { Bot } from 'src/bots/bot.entity';

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

  async listAllUsers(user_id: number): Promise<Organization[]> {
    return this.organizationModel.findAll({
      where: {
        user_id
      },
      include: [User, Bot],
    });
  }
  
  async findOneUsersById(user_id: number, id: number): Promise<Organization> {
    return this.organizationModel.findOne({
      where: {
        user_id,
        id
      },
      include: [User, Bot],
    });
  }
}
