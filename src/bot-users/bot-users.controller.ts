import { Controller, UseGuards, Body, BadRequestException, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, Override, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BotUsersService } from './bot-users.service';
import { BotUser } from './bot-user.entity';
import { BotUsersCrudService } from './bot-users-crud.service';
import { User } from 'src/users/user.entity';
import { BotGuard } from 'src/common/guards/BotsGuard';
import { UpdateBotUserDto } from './dto/update-bot-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserD } from 'src/auth/user.decorator';

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
    },
  },
  params: {
    botId: {
      field: 'botId',
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
@ApiTags('bot-users')
@Controller('/:botId/bot-users')
@UseGuards(
  JwtAuthGuard,
  BotGuard
)
export class BotUsersController implements CrudController<BotUser> {
  constructor(
    public service: BotUsersCrudService,
    private botUsersService: BotUsersService,
    private usersService: UsersService,
  ) {}
  
  @Override()
  async updateOne(@UserD() user, @Body() updateBotUserDto: UpdateBotUserDto): Promise<BotUser> {
    const botUser = await this.botUsersService.findOneWithBot(updateBotUserDto.id);
    await this.validateCall(user, botUser.bot.organizationId);
    const { id, ...data } = updateBotUserDto;
    return this.botUsersService.updateOne(id, data);
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}