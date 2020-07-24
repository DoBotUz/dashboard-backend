import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { BranchesModule } from 'src/branches/branches.module';
import { BotsModule } from 'src/bots/bots.module';
import { Organization } from './organization.entity';
import { IsOrganizationExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([Organization]), BranchesModule, BotsModule],
  providers: [OrganizationsService, IsOrganizationExists],
  controllers: [OrganizationsController]
})
export class OrganizationsModule {}
