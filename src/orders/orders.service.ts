import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {}
  
  async listAll(bot_id: number): Promise<Order[]> {
    return this.orderModel.findAll({
      where: {
        bot_id
      },
      include: [BotUser]
    })
  }

  async findOne(id: number): Promise<Order> {
    return this.orderModel.findOne({
      where: {
        id,
      },
      include: [BotUser]
    });
  }

  async updateOne(id: number, data: any): Promise<Order> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }
}
