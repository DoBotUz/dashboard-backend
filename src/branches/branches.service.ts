import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch, STATUSES } from './branch.entity';
import { Organization } from 'src/organizations/organization.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
  ) {}

  async findOne(id: number): Promise<Branch> {
    return this.branchesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async createNew(data: any): Promise<Branch> {
    data.status = STATUSES.ACTIVE;
    const branch = new Branch();
    Object.assign(branch, data);
    return await this.branchesRepository.save(branch);
  }

  async updateOne(id: number, data: any): Promise<Branch> {
    const branch = await this.findOne(id);
    Object.assign(branch, data);
    return await this.branchesRepository.save(branch);
  }
}
