import { Controller, UseGuards, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BotUsersService } from './bot-users.service';
import { BotUser } from './bot-user.entity';
import { BotUsersCrudService } from './bot-users-crud.service';
import { User } from 'src/users/user.entity';

@Crud({
  model: {
    type: BotUser,
  },
  routes: {
    only: ["getManyBase", "getOneBase", "updateOneBase"],
  },
  query: {
    join: {
      bot: {
        eager: true,
      },
      'bot.organization': {
        eager: true,
        select: false,
      },
      'bot.organization.user': {
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
    'bot.organization.user.id': user.id,
  })
})
@ApiTags('bot-users')
@Controller('/:organizationId/bot-users')
@UseGuards(JwtAuthGuard)
export class BotUsersController implements CrudController<BotUser> {
  constructor(
    public service: BotUsersCrudService,
    private botUsersService: BotUsersService,
  ) {}
}