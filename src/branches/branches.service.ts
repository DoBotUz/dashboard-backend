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

  async createNew(data: any): Promise<Branch> {
    data.status = STATUSES.ACTIVE;
    const branch = new Branch();
    Object.assign(branch, data);
    return await this.branchesRepository.save(branch);
  }

  async findOne(id: number): Promise<Branch> {
    return this.branchesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async listAll(organization_id: number): Promise<Branch[]> {
    return this.branchesRepository.find({
      where: {
        organization_id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Branch> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.branchesRepository.save(model);
  }

  async activate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = STATUSES.ACTIVE;
    await this.branchesRepository.save(model);
  }

  async deactivate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = STATUSES.INACTIVE;
    await this.branchesRepository.save(model);
  }

  async delete(id: number): Promise<void> {
    const model = await this.findOne(id);
    await this.branchesRepository.remove(model);
  }
}
