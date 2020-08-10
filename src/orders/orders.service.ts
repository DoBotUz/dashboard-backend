import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}
  
  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Order> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.ordersRepository.save(model);
  }

  async updateItems(order_id: number, orderItems: any[]): Promise<any[]> {
    // await this.orderItemModel.destroy({
    //   where: {
    //     order_id
    //   }
    // });
    // orderItems.forEach(async (orderItem) => {
    //   await this.orderItemModel.create(orderItem.toJSON())
    // });
    // return orderItems;
    return [];
  }
}
