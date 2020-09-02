import * as moment from 'moment';
moment.locale('ru');
import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Organization } from 'src/organizations/organization.entity';

@Injectable()
export class AnalyticsService {
  constructor(private connection: Connection) {}
  private logger: Logger = new Logger('AnalyticsService');

  async getAllCategorilyOrders(organizationId: number) {
    let result = [];
    try {
      result = await this.connection.query("SELECT COUNT(category.id) as total, category.ru_title from category INNER JOIN item on item.categoryId = category.id INNER JOIN order_item on order_item.itemId = item.id INNER JOIN `order` on order_item.orderId = `order`.id and `order`.organizationId = ? GROUP BY category.ru_title", [organizationId]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getAllCategorilyOrders'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }
    const labels = [];
    const series = [];
    for(let i = 0; i < result.length; i++){
      labels.push(result[i].ru_title);
      series.push(Number(result[i].total));
    }
    return {
      labels,
      series
    }
  }

  async getCategorilyOrdersForPeriod(organizationId: number,startDate: Date, endDate: Date) {
    let result = [];
    try {
      result = await this.connection.query("SELECT COUNT(category.id) as total, category.ru_title from category INNER JOIN item on item.categoryId = category.id INNER JOIN order_item on order_item.itemId = item.id INNER JOIN `order` on order_item.orderId = `order`.id and `order`.organizationId = ? WHERE ( `order`.created_at BETWEEN ? and ? ) GROUP BY category.ru_title", [organizationId, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss') ]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getCategorilyOrdersForPeriod'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }
    const labels = [];
    const series = [];
    for(let i = 0; i < result.length; i++){
      labels.push(result[i].ru_title);
      series.push(Number(result[i].total));
    }
    return {
      labels,
      series
    }
  }

  
  async getBotUsersForPeriod(organizationId: number, startDate: Date, endDate: Date) {
    let result = [];
    try{
      result = await this.connection.query("SELECT COUNT(bot_user.id) as total, `created_at` as `date` FROM bot_user where organizationId=? and ( `created_at` BETWEEN ? and ? ) GROUP BY created_at", [organizationId, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss')]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getBotUsersForPeriod'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }

    return this.transformToDates(result);
  }

  async getOrdersForPeriod(organizationId: number, startDate: Date, endDate: Date) {
    let result = [];
    try{
      result = await this.connection.query("SELECT COUNT(`order`.id) as total, `created_at` as `date` FROM `order` where organizationId=? and ( `created_at` BETWEEN ? and ? ) GROUP BY created_at", [organizationId, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss')]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getOrdersForPeriod'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }

    return this.transformToDates(result);
  }

  async getMonthlyBotUsers(organizationId: number) {
    let result = [];
    try{
      result = await this.connection.query("SELECT COUNT(bot_user.id) as total, DATE_FORMAT(ANY_VALUE(created_at), '%Y-%m') as `date` FROM bot_user where organizationId=? GROUP BY DATE_FORMAT(created_at, '%Y%m')", [organizationId]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getMonthlyBotUsers'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }

    return this.transformToMonthly(result);
  }

  async getMonthlyOrders(organizationId: number) {
    let result = [];
    try{
      result = await this.connection.query("SELECT COUNT(`order`.id) as total, DATE_FORMAT(ANY_VALUE(created_at), '%Y-%m') as `date` FROM `order` where organizationId=? GROUP BY DATE_FORMAT(created_at, '%Y%m')", [organizationId]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getMonthlyOrders'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }

    return this.transformToMonthly(result);
  }

  async generateBotUsers(organizationId: number, startDate: Date) {
    for (let i = 504; i < 505; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + Math.floor(Math.random()*5) + i);
      const created_at = moment(nextDate).format('YYYY-MM-DD HH:mm:ss');
      await this.connection.query("INSERT INTO `bot_user` (`id`, `tg_id`, `first_name`, `last_name`, `phone_number`, `username`, `bio`, `avatar`, `language`, `last_seen`, `created_at`, `updated_at`, `botId`, `organizationId`, `status`) VALUES (NULL, ?, ?, NULL, NULL, NULL, NULL, NULL, 'ru', NULL, ?, ?, ?, ?, '10');", [i+100, 'John', created_at, created_at, organizationId, organizationId]);

    }
  }

  async getGeoOrdersAll(organizationId: number) {
    let result = [];
    try{
      result = await this.connection.query("SELECT `lat`, `lng` FROM `order` where organizationId=? and `lat` IS NOT NULL and `lng` IS NOT NULL", [organizationId]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getGeoOrdersAll'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }
    return this.transformLatLngForYandex(result);
  }

  async getGeoOrdersForPeriod(organizationId: number, startDate: Date, endDate: Date) {
    let result = [];
    try{
      result = await this.connection.query("SELECT `lat`, `lng` FROM `order` where organizationId=? and `lat` IS NOT NULL and `lng` IS NOT NULL and ( `created_at` BETWEEN ? and ? )", [organizationId, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss')]);
    } catch(e) {
      this.logger.log(`Error on getting data from database for 'getGeoOrdersForPeriod'\n ${e}`);
      throw new InternalServerErrorException('Database query error');
    }
    return this.transformLatLngForYandex(result);
  }

  async generateOrders(organization: Organization) {
    const branch_ids = (await organization.branches).map((el) => { return el.id });
    if (!branch_ids.length) {
      throw new BadRequestException('No branches in organization');
    }
    const bot_user_ids = (await organization.bot.botUsers).map((el) => { return el.id });

    if (!bot_user_ids.length) {
      throw new BadRequestException('No bot users in organization');
    }

    if (!(await organization.categories).length) {
      throw new BadRequestException('No categories in organization');
    }

    const startDate = organization.created_at;

    const categoriesWithItems = (await organization.categories).filter(async (cat) => { return (await cat.items).length !== 0 });

    if (!categoriesWithItems.length) {
      throw new BadRequestException('Categories does not have items');
    }
      
    for (let i = 0; i < 1000; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + Math.floor(Math.random()*365));
      const created_at = moment(nextDate).format('YYYY-MM-DD HH:mm:ss');

      const botUserId = bot_user_ids[Math.floor(Math.random()*bot_user_ids.length)];
      const branchId = branch_ids[Math.floor(Math.random()*branch_ids.length)];

      const items = [];
      let totalCharge = 0;

      for (let j =0; j < categoriesWithItems.length; j++) {
        if (Math.floor(Math.random()*2) >= 1) {
          // Insert category;
           for (let p = 0; p < (await categoriesWithItems[j].items).length; p++) {
            if (Math.floor(Math.random()*2) >= 1) {
              //Insert item;
              // console.log((await categoriesWithItems[j].items));
              const itemEl = (await categoriesWithItems[j].items)[p];
              const itemId = itemEl.id;
              const amount = Math.floor(Math.random()*10);
              totalCharge += amount*itemEl.price;
              items.push({itemId, amount});
            }
           }
        }
      }

      if(!items.length){
        continue;
      }

      let orderId = null;

      const start_lat = 41.396390;
      const start_lng =  69.178457;
      const end_lat = 41.253010;
      const end_lng =  69.358358;
      const lat = Math.random() * (end_lat - start_lat) + start_lat;
      const lng = Math.random() * (end_lng - start_lng) + start_lng;
      
      try {
        orderId = (await this.connection.query("INSERT INTO `order` (`id`, `total_charge`, `delivery_charge`, `for_datetime`, `lat`, `lng`, `address`, `payment_type`, `phone`, `comment`, `is_paid`, `created_at`, `updated_at`, `botUserId`, `organizationId`, `branchId`, `promocodeId`, `status`, `is_self_service`) VALUES (NULL, ?, '1000', ?, ?, ?, NULL, '10', '', NULL, '0', ?, ?, ?, ?, ?, NULL, '9', '0');", [totalCharge, created_at, lat, lng, created_at, created_at, botUserId, organization.id, branchId])).insertId;
      } catch(e) {
        this.logger.log(`Error on inserting data to database for order\n ${e}`);
        throw new InternalServerErrorException("Database error. Order Inserting");
      }

      for(let j = 0; j < items.length; j++){
        this.connection.query("INSERT INTO `order_item` (`id`, `orderId`, `itemId`, `amount`) VALUES (NULL, ?, ?, ?)", [orderId, items[j].itemId, items[j].amount]);
      }
    }
  }

  private transformToMonthly(result: any[]): any {
    const data = [];
    for(let i = 0; i < result.length; i++){
      const resultDate = result[i].date.split('-');
      const currentDate = moment([Number(resultDate[0]), Number(resultDate[1]) - 1, 1]);

      data.push({
        x: currentDate.toISOString(),
        y: Number(result[i].total)
      })
    }

    return data;
  }

  private transformToDates(result: any[]): any {
    const data = [];
    for(let i = 0; i < result.length; i++){
      const currentDate = moment(result[i].date);
      data.push({
        x: currentDate.toISOString(),
        y: Number(result[i].total)
      })
    }

    return data;
  }

  private transformLatLngForYandex(result: any[]): any {
    const data = [];
    for(let i = 0; i < result.length; i++){
      data.push([result[i].lat, result[i].lng]);
    }
    return data;
  }
}
