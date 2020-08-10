import { Controller, UseGuards, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BotUsersService } from './bot-users.service';
import { BotUser } from './bot-user.entity';
import { BotUsersCrudService } from './bot-users-crud.service';

@Crud({
  model: {
    type: BotUser,
  },
  routes: {
    only: ["getManyBase", "getOneBase", "updateOneBase"],
  },
})
@ApiTags('bot-users')
@Controller('bot-users')
@UseGuards(JwtAuthGuard)
export class BotUsersController implements CrudController<BotUser> {
  constructor(
    public service: BotUsersCrudService,
    private botUsersService: BotUsersService,
  ) {}
}