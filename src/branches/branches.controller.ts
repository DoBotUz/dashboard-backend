import { Controller, UseGuards, Param, Post, } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, ParsedBody, ParsedRequest, CrudRequest, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BranchesService } from './branches.service';
import { Branch } from './branch.entity';
import { BranchesCrudService } from './branches-crud.service';

@Crud({
  model: {
    type: Branch
  },
  params: {
    organizationId: {
      field: 'organizationId',
      type: 'number'
    }
  }
})
@ApiTags('branches')
@Controller('/organizations/:organizationId/branches')
@UseGuards(JwtAuthGuard)
export class BranchesController implements CrudController<Branch> {
  constructor(
    public service: BranchesCrudService,
    private branchesService: BranchesService,
  ) {}

  get base(): CrudController<Branch> {
    return this;
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
