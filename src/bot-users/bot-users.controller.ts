import { Controller, Get, UseGuards, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { BotUsersService } from './bot-users.service';
import { UpdateBotUserDTO } from './dto';
import { BotUser } from './bot-user.entity';

@ApiTags('bot-users')
@Controller('bot-users')
@UseGuards(JwtAuthGuard)
export class BotUsersController {
  constructor(
    private botUsersService: BotUsersService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of BotUsers',
    isArray: true,
    type: BotUser
  })
  async listAll(@UserD() user, @Param("bot_id") bot_id): Promise<BotUser[]> {
    return this.botUsersService.listAll(bot_id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get bot User by id',
    type: BotUser
  })
  async get(@UserD() user, @Param("id") id): Promise<BotUser> {
    return await this.botUsersService.findOne(id);
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: BotUser
  })
  async updateOne(@Body() updateBotUserDTO: UpdateBotUserDTO): Promise<BotUser> {
    const { id, ...data } = updateBotUserDTO;
    return this.botUsersService.updateOne(id, data);
  }
}