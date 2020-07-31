import { Controller, Get, UseGuards, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { OrdersService } from './orders.service';
import { UpdateOrderDTO } from './dto';
import { Order } from './order.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of Orders',
    isArray: true,
    type: Order
  })
  async listAll(@UserD() user, @Param("bot_id") bot_id): Promise<Order[]> {
    return this.ordersService.listAll(bot_id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get bot User by id',
    type: Order
  })
  async get(@UserD() user, @Param("id") id): Promise<Order> {
    return await this.ordersService.findOne(id);
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Order
  })
  async updateOne(@Body() updateOrderDTO: UpdateOrderDTO): Promise<Order> {
    const { id, ...data } = updateOrderDTO;
    return this.ordersService.updateOne(id, data);
  }
}