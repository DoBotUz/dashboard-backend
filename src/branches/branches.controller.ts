import { Controller, UseGuards, Param, Post, Get, } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BranchesService } from './branches.service';
import { Branch } from './branch.entity';
import { BranchesCrudService } from './branches-crud.service';
import { CreateBranchDto } from './dto';
import { UserD } from 'src/auth/user.decorator';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from '../common/guards/OrganizationsGuard';

@Crud({
  model: {
    type: Branch
  },
  dto: {
    // create: CreateBranchDto,
  },
  query: {
    join: {
      organization: {
        eager: true,
      },
      'organization.user': {
        eager: true,
        select: false,
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
    'organization.user.id': user.id,
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
  ) {}

  get base(): CrudController<Branch> {
    return this;
  }


  @Get('test')
  async test(@UserD() user) {
    return 'hello';
  }

  @Post("deactivate/:id")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async deactivate(@Param("id") id): Promise<boolean> {
    await this.branchesService.deactivate(id);
    return true;
  }

  @Post("activate/:id")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async activate(@Param("id") id): Promise<boolean> {
    await this.branchesService.activate(id);
    return true;
  }
}
