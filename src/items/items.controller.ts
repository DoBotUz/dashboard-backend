import { Controller, Get, UseGuards, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { ItemsService } from './items.service';
import { CreateItemDTO, UpdateItemDTO } from './dto';
import { Item } from './item.entity';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(
    private itemsService: ItemsService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of Items',
    isArray: true,
    type: Item
  })
  async listAll(@UserD() user, @Param("bot_id") bot_id): Promise<Item[]> {
    return this.itemsService.listAll(bot_id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Item
  })
  async create(@UserD() user, @Body() data: CreateItemDTO): Promise<Item> {
    return this.itemsService.createNew(data);
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Item
  })
  async updateOne(@Body() updateItemDto: UpdateItemDTO): Promise<Item> {
    const { id, ...data } = updateItemDto;
    return this.itemsService.updateOne(id, data);
  }

  @Post("deactivate/:id")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async deactivate(@Param("id") id): Promise<boolean> {
    await this.itemsService.deactivate(id);
    return true;
  }

  @Post("activate/:id")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async activate(@Param("id") id): Promise<boolean> {
    await this.itemsService.activate(id);
    return true;
  }

  @Delete(":id")
  @ApiOkResponse({
    description: 'Sucessfuly Deleted',
    type: Boolean
  })
  async delete(@Param("id") id): Promise<boolean> {
    await this.itemsService.delete(id);
    return true;
  }
}
