import { Controller, UseGuards, Body, BadRequestException, Post, } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrdersCrudService } from './orders-crud.service';
import { User } from 'src/users/user.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UsersService } from 'src/users/users.service';
import { UserD } from 'src/auth/user.decorator';

@Crud({
  model: {
    type: Order
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC',
      },
    ],
    join: {
      organization: {
        eager: true,
      },
      branch: {
        eager: true
      },
      order_items: {
        eager: true
      }
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
    'organization.userId': user.id,
  })
})
@ApiTags('orders')
@Controller('/:organizationId/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController implements CrudController<Order> {
  constructor(
    public service: OrdersCrudService,
    private ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  
  @Post("/update")
  @ApiOkResponse({
    description: 'Updates one order',
    type: Order
  })
  async updateOne(@UserD() user, @Body() updateOrderDTO: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersService.findOne(updateOrderDTO.id);
    await this.validateCall(user, order.organizationId);
    
    const { id, ...data } = updateOrderDTO;
    this.ordersService.updateItems(id, data.order_items);
    delete data.order_items;
    return this.ordersService.updateOne(id, data);
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}