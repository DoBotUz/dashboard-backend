import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { ItemsService } from './items.service';
import { CreateItemDTO, UpdateItemDTO } from './dto';
import { Item } from './item.entity';
import { FilesService } from 'src/files/files.service';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(
    private itemsService: ItemsService,
    private filesService: FilesService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of Items',
    isArray: true,
    type: Item
  })
  async list(@UserD() user, @Param("bot_id") bot_id): Promise<Item[]> {
    return this.itemsService.listAll(bot_id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get item by id',
    type: Item
  })
  async get(@UserD() user, @Param("id") id): Promise<Item> {
    return await this.itemsService.findOne(id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Item
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'thumbnail',
        maxCount: 1,
      },
      {
        name: 'files',
        maxCount: 20,
      }
    ], {
      storage: diskStorage({
        destination: 'tmp/uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(@UserD() user, @Body() data: CreateItemDTO, @UploadedFiles() uploadedFiles): Promise<Item> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/items/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const model = await this.itemsService.createNew(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('ITEM', model.id, uploadedFiles.files);
    }
    return model;
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Item
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/items/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async update(@Body() updateItemDto: UpdateItemDTO, @UploadedFile() thumbnail): Promise<Item> {
    const { id, ...data } = updateItemDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
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
