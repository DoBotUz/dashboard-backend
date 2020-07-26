import { Controller, UseGuards, Post, Body, } from '@nestjs/common';
import {ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { OrganizationsService } from './organizations.service';
import { CreateOrganizationBranchBotDTO, UpdateOrganizationDTO } from './dto';
import { BranchesService } from 'src/branches/branches.service';
import { BotsService } from 'src/bots/bots.service';
import { Organization } from './organization.entity';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(
    private organizationsService: OrganizationsService,
    private branchesService: BranchesService,
    private botsService: BotsService,
  ) {}
  
  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Organization
  })
  async create(@UserD() user, @Body() data: CreateOrganizationBranchBotDTO): Promise<any> {
    const org = await this.organizationsService.createNew({
      user_id: user.id,
      ...data
    });

    const bot = await this.botsService.createNew({
      organization_id: org.id,
      ...data.bot,
    });
    return {
      organization: org,
      bot,
    };
  }

  @Post('update')
  @ApiOkResponse({
    description: 'Sucessfuly Update',
    type: Organization
  })
  async update(@UserD() user, @Body() updateOrganizationDTO: UpdateOrganizationDTO): Promise<any> {
    const { id, ...data } = updateOrganizationDTO;
    return this.organizationsService.updateOne(id, data);
  }
}
