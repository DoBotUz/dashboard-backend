import { Controller, UseGuards, Param, Post, Get, Body, BadRequestException, } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BranchesService } from './branches.service';
import { Branch } from './branch.entity';
import { BranchesCrudService } from './branches-crud.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { UserD } from 'src/auth/user.decorator';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from '../common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';

@Crud({
  model: {
    type: Branch
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase'],
  },
  query: {
    join: {
      organization: {
        eager: true,
      },
    },
  },
  params: {
    organizationId: {
      field: 'organizationId',
      type: 'number'
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    'organization.userId': user.id,
  })
})
@ApiTags('branches')
@Controller('/:organizationId/branches')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard
)
export class BranchesController implements CrudController<Branch> {
  constructor(
    public service: BranchesCrudService,
    private branchesService: BranchesService,
    private usersService: UsersService,
  ) {}

  @Override()
  async createOne(@UserD() user, @Body() data: CreateBranchDto): Promise<Branch> {
    await this.validateCall(user, data.organizationId);

    return this.branchesService.createNew(data);
  }

  @Override()
  async updateOne(@UserD() user, @Body() updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const model = await this.branchesService.findOne(updateBranchDto.id);
    await this.validateCall(user, model.organizationId);

    const { id, ...data } = updateBranchDto;
    return this.branchesService.updateOne(id, data);
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
