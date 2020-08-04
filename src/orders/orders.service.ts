import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { Item } from 'src/items/item.entity';
import { OrderItem } from './order-item.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Branch } from 'src/branches/branch.entity';
import { Organization } from 'src/organizations/organization.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
  ) {}
  
  async listAll(organization_id: number): Promise<Order[]> {
    return this.orderModel.findAll({
      where: {
        organization_id
      },
      include: [BotUser]
    })
  }

  async findOne(id: number): Promise<Order> {
    return this.orderModel.findOne({
      where: {
        id,
      },
      include: [BotUser, Branch, Organization, {
        model: OrderItem,
        include: [Item]
      }]
    });
  }

  async updateOne(id: number, data: any): Promise<Order> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }

  async updateItems(order_id: number, orderItems: any[]): Promise<any[]> {
    await this.orderItemModel.destroy({
      where: {
        order_id
      }
    });
    orderItems.forEach(async (orderItem) => {
      await this.orderItemModel.create(orderItem.toJSON())
    });
    return orderItems;
  }
}
