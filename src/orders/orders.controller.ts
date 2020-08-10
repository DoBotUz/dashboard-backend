import { Controller, UseGuards, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrdersCrudService } from './orders-crud.service';
import { User } from 'src/users/user.entity';

@Crud({
  model: {
    type: Order
  },
  query: {
    join: {
      organization: {
        eager: true,
      },
      'organization.user': {
        eager: true,
        select: false,
      },
    },
  },
  params: {
    organizationId: {
      field: 'organizationId',
      type: 'number'
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    'organization.user.id': user.id,
  })
})
@ApiTags('orders')
@Controller('/:organizationId/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController implements CrudController<Order> {
  constructor(
    public service: OrdersCrudService,
    private ordersService: OrdersService,
  ) {}
}