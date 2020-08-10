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
}
