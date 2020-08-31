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
@Feature('analytics')
@UseGuards(JwtAuthGuard, ACLGuard, OrganizationGuard)
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private organizationsService: OrganizationsService,
  ) {}


  @Get('bot-users-info-monthly')
  @Action('Read-One')
  async getBotUsersInfo(@Param('organizationId') organizationId: number): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization)
      throw new NotFoundException('404');

    const data = await this.analyticsService.getMonthlyBotUsers(organizationId);
    return {
      series: [
        {
          name: 'Подписчиков',
          data
        }
      ]
    };
  }

  @Get('orders-info-monthly')
  @Action('Read-One')
  async getOrdersInfoMonthly(@Param('organizationId') organizationId: number): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization)
      throw new NotFoundException('404');

    const data = await this.analyticsService.getMonthlyOrders(organizationId);
    return {
      series: [
        {
          name: 'Заказов',
          data
        }
      ]
    };
  }

  @Get('orders-info-categories')
  @Action('Read-One')
  async getOrdersInfoCategories(@Param('organizationId') organizationId: number): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization)
      throw new NotFoundException('404');

    const data = await this.analyticsService.getAllCategorilyOrders(organizationId);
    return data;
  }

  @Get('period-info')
  @Action('Read-One')
  async getForPeriod(@Param('organizationId') organizationId: number, @Query('start') start, @Query('end') end): Promise<any> {
    const organization = await this.organizationsService.findOne(organizationId);
    if(!organization)
      throw new NotFoundException('404');
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    return {
      bot_users: {
        series: [
          {
            name: 'Подписчиков',
            data: await this.analyticsService.getBotUsersForPeriod(organizationId, startDate, endDate)
          }
        ]
      },
      orders: {
        series: [
          {
            name: 'Заказов',
            data: await this.analyticsService.getOrdersForPeriod(organizationId, startDate, endDate)
          }
        ]
      },
      category_orders: await this.analyticsService.getCategorilyOrdersForPeriod(organizationId, startDate, endDate),
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
