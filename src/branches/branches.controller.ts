import { Controller, UseGuards, Param, Post, } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BranchesService } from './branches.service';
import { Branch } from './branch.entity';
import { BranchesCrudService } from './branches-crud.service';

@Crud({
  model: {
    type: Branch
  }
})
@ApiTags('branches')
@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchesController implements CrudController<Branch> {
  constructor(
    public service: BranchesCrudService,
    private branchesService: BranchesService,
  ) {}

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
