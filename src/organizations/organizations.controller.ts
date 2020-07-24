import { Controller, Get, UseGuards, Param, Post, Body, Put, BadRequestException, Delete, Query } from '@nestjs/common';
import { ValidationException } from '../validation-exception';
import { ApiResponse, ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { OrganizationsService } from './organizations.service';
import { CreateOrganizationBranchBot } from './dto/create-organization-branch-bot.dto';
import { BranchesService } from 'src/branches/branches.service';
import { BotsService } from 'src/bots/bots.service';
import { Organization } from './organization.entity';
import { title } from 'process';

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
  async create(@UserD() user, @Body() data: CreateOrganizationBranchBot): Promise<any> {
    const org = await this.organizationsService.createNew({
      user_id: user.id,
      ...data
    });

    const branch = await this.branchesService.createNew({
      organization_id: org.id,
      ...data.branch
    });
    const bot = await this.botsService.createNew({
      organization_id: org.id,
      ...data.bot,
    });
    return {
      organization: org,
      bot,
      branch,
    };
  }
}
