import { Controller, Get, UseGuards, Param, Post, Body, Put, BadRequestException, Delete, Query } from '@nestjs/common';
import { ValidationException } from '../validation-exception';
import { ApiResponse, ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { OrganizationsService } from './organizations.service';
import { CreateOrganizationBranchBot } from './dto/create-organization-branch-bot.dto';
import { BranchesService } from 'src/branches/branches.service';
import { BotsService } from 'src/bots/bots.service';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(
    private organizationsService: OrganizationsService,
    private branchesService: BranchesService,
    private botsService: BotsService,
  ) {}

}
