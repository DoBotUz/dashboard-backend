import { Controller, Get, UseGuards, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { BranchesService } from './branches.service';
import { CreateBranchDTO, UpdateBranchDTO } from './dto';
import { Branch } from './branch.entity';

@ApiTags('branches')
@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchesController {
  constructor(
    private branchesService: BranchesService,
  ) {}

  @Get(':organization_id/list')
  @ApiOkResponse({
    description: 'Array of Branches',
    isArray: true,
    type: Branch
  })
  async listAll(@UserD() user, @Param("organization_id") organization_id): Promise<Branch[]> {
    return this.branchesService.listAll(organization_id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Branch
  })
  async create(@UserD() user, @Body() data: CreateBranchDTO): Promise<Branch> {
    return this.branchesService.createNew(data);
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Branch
  })
  async updateOne(@Body() updateBranchDto: UpdateBranchDTO): Promise<Branch> {
    const { id, ...data } = updateBranchDto;
    return this.branchesService.updateOne(id, data);
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

  @Delete(":id")
  @ApiOkResponse({
    description: 'Sucessfuly Deleted',
    type: Boolean
  })
  async delete(@Param("id") id): Promise<boolean> {
    await this.branchesService.delete(id);
    return true;
  }
}
