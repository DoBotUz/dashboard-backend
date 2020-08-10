import { Controller, UseGuards, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrdersCrudService } from './orders-crud.service';

@Crud({
  model: {
    type: Order
  }
})
@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController implements CrudController<Order> {
  constructor(
    public service: OrdersCrudService,
    private ordersService: OrdersService,
  ) {}
}