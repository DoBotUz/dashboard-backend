import { Controller, Get, UseGuards, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { CategoriesService } from './categories.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of Categories',
    isArray: true,
    type: Category
  })
  async listAll(@UserD() user, @Param("bot_id") bot_id): Promise<Category[]> {
    return this.categoriesService.listAll(bot_id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Category
  })
  async create(@UserD() user, @Body() data: CreateCategoryDTO): Promise<Category> {
    return this.categoriesService.createNew(data);
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Category
  })
  async updateOne(@Body() updateCategoryDto: UpdateCategoryDTO): Promise<Category> {
    const { id, ...data } = updateCategoryDto;
    return this.categoriesService.updateOne(id, data);
  }

  @Post("deactivate/:id")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async deactivate(@Param("id") id): Promise<boolean> {
    await this.categoriesService.deactivate(id);
    return true;
  }

  @Post("activate/:id")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async activate(@Param("id") id): Promise<boolean> {
    await this.categoriesService.activate(id);
    return true;
  }

  @Delete(":id")
  @ApiOkResponse({
    description: 'Sucessfuly Deleted',
    type: Boolean
  })
  async delete(@Param("id") id): Promise<boolean> {
    await this.categoriesService.delete(id);
    return true;
  }
}
