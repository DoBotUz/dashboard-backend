import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { BranchesModule } from 'src/branches/branches.module';
import { BotsModule } from 'src/bots/bots.module';
import { Organization } from './organization.entity';
import { IsOrganizationExists } from './validators';
import { OrgCrudService } from './org-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), BranchesModule, BotsModule],
  providers: [OrgCrudService, OrganizationsService, IsOrganizationExists],
  controllers: [OrganizationsController]
})
export class OrganizationsModule {}
