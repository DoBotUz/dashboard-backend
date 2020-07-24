import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from './branch.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch)
    private branchnModel: typeof Branch,
  ) {}

  async createNew(data: any): Promise<Branch> {
    data.status = this.branchnModel.STATUSES.ACTIVE;
    return await this.branchnModel.create(data);
  }
}
