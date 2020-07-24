import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { BranchesModule } from 'src/branches/branches.module';
import { BotsModule } from 'src/bots/bots.module';
import { Organization } from './organization.entity';

@Module({
  imports: [SequelizeModule.forFeature([Organization]), BranchesModule, BotsModule],
  providers: [OrganizationsService],
  controllers: [OrganizationsController]
})
export class OrganizationsModule {}
