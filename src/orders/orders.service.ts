import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item';
import { UpdateOrderDto, OrderItemDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}
  
  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: UpdateOrderDto): Promise<Order> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.ordersRepository.save(model);
  }

  async updateItems(orderId: number, orderItems: OrderItemDto[]): Promise<OrderItemDto[]> {
    await this.orderItemsRepository.delete({
      orderId
    });
    orderItems.forEach(async (orderItem) => {
      const model = new OrderItem();
      Object.assign(model, orderItem);
      await this.orderItemsRepository.insert(model);
    });
    return orderItems;
  }
}
