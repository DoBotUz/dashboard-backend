import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from './branch.entity';
import { Organization } from 'src/organizations/organization.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch)
    private branchesModel: typeof Branch,
  ) {}

  async createNew(data: any): Promise<Branch> {
    data.status = this.branchesModel.STATUSES.ACTIVE;
    return await this.branchesModel.create(data);
  }

  async findOne(id: number): Promise<Branch> {
    return this.branchesModel.findOne({
      where: {
        id,
      },
      include: [Organization]
    });
  }

  async listAll(organization_id: number): Promise<Branch[]> {
    return this.branchesModel.findAll({
      where: {
        organization_id,
      },
      include: [Organization]
    });
  }

  async updateOne(id: number, data: any): Promise<Branch> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }

  async activate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = Branch.STATUSES.ACTIVE;
    await model.save();
  }

  async deactivate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = Branch.STATUSES.INACTIVE;
    await model.save();
  }

  async delete(id: number): Promise<void> {
    const model = await this.findOne(id);
    await model.destroy();
  }
}
