import { Controller, Get, Param, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ACLGuard } from 'src/common/guards/ACL.guard';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { Feature, Action } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('/:organizationId/analytics')
@UseGuards(JwtAuthGuard, ACLGuard, OrganizationGuard)
@Feature('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private organizationsService: OrganizationsService,
  ) {}

  @Get('orders-geo')
  @Action('Read-One')
  async getOrdersGeo(@Param('organizationId') organizationId: number, @Query('start') start, @Query('end') end): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization || !start || !end)
      throw new NotFoundException('404');

    const startDate = new Date(start);
    const endDate = new Date(end);
    return { data: await this.analyticsService.getGeoOrdersForPeriod(organizationId, startDate, endDate) };
  }
  
  @Get('period-info')
  @Action('Read-One')
  async getForPeriod(@Param('organizationId') organizationId: number, @Query('start') start, @Query('end') end, @Query('type') type): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization || !start || !end || !type)
      throw new NotFoundException('404');
    const startDate = new Date(start);
    const endDate = new Date(end);

    return {
      bot_users: {
        series: [
          {
            name: 'Подписчиков',
            data: await this.analyticsService.getBotUsers(organizationId, startDate, endDate, type)
          }
        ]
      },
      orders: {
        series: [
          {
            name: 'Заказов',
            data: await this.analyticsService.getOrders(organizationId, startDate, endDate, type)
          }
        ]
      },
      category_orders: await this.analyticsService.getCategorilyOrdersForPeriod(organizationId, startDate, endDate),
      product_orders: await this.analyticsService.getProductlyOrdersForPeriod(organizationId, startDate, endDate),
      metaData: await this.analyticsService.getMetaDataForPeriod(organizationId, startDate, endDate),
    }
  }

  @Get('generate-bot-users')
  @Action('Read-One')
  async generateBotUsers(@Param('organizationId') organizationId: number): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization)
      throw new NotFoundException('404');

    return this.analyticsService.generateBotUsers(organizationId, new Date(organization.created_at));
  }

  @Get('generate-orders')
  @Action('Read-One')
  async generateOrders(@Param('organizationId') organizationId: number): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization)
      throw new NotFoundException('404');

    return this.analyticsService.generateOrders(organization);
  }
}
