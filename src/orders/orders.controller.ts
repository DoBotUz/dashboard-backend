import { Controller, UseGuards, Body, BadRequestException, Post, } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { OrdersService } from './orders.service';
import { Order, STATUSES } from './order.entity';
import { OrdersCrudService } from './orders-crud.service';
import { User } from 'src/users/user.entity';
import { UpdateOrderDto, UpdateOrderStatusDto } from './dto/update-order.dto';
import { UsersService } from 'src/users/users.service';
import { UserD } from 'src/auth/user.decorator';
import { ACLGuard } from 'src/common/guards/ACL.guard';

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
    filter: {
      status: {
        $ne: STATUSES.DELETED,
      }
    }
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
@UseGuards(JwtAuthGuard, ACLGuard)
export class OrdersController implements CrudController<Order> {
  constructor(
    public service: OrdersCrudService,
    private ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  get base(): CrudController<Order> {
    return this;
  }

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

  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Order
  })
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const item = await this.ordersService.findOne(updateStatusDto.id);
    await this.validateCall(user, item.organizationId);
    const { id, ...data } = updateStatusDto;
    return this.ordersService.updateOne(id, data);
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}