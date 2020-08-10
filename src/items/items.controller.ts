import * as fs from 'fs';
import { Controller, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth, } from '@nestjsx/crud';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { ItemsService } from './items.service';
import { CreateItemDTO, UpdateItemDTO } from './dto';
import { Item } from './item.entity';
import { FilesService } from 'src/files/files.service';
import { ItemsCrudService } from './items-crud.service';
import { User } from 'src/users/user.entity';


@Crud({
  model: {
    type: Item
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
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    'bot.organization.user.id': user.id,
  })
})
@ApiTags('items')
@Controller('/:organizationId/items')
@UseGuards(JwtAuthGuard)
export class ItemsController implements CrudController<Item> {
  constructor(
    public service: ItemsCrudService,
    private itemsService: ItemsService,
    private filesService: FilesService,
  ) {}

  @Override()
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
  async createOne(@UserD() user, @Body() data: CreateItemDTO, @UploadedFiles() uploadedFiles): Promise<Item> {
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

  @Override()
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/items/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async updateOne(@Body() updateItemDto: UpdateItemDTO, @UploadedFile() thumbnail): Promise<Item> {
    const { id, ...data } = updateItemDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    return this.itemsService.updateOne(id, data);
  }

  @Post('deactivate/:id')
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async deactivate(@Param('id') id): Promise<boolean> {
    await this.itemsService.deactivate(id);
    return true;
  }

  @Post('activate/:id')
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Boolean
  })
  async activate(@Param('id') id): Promise<boolean> {
    await this.itemsService.activate(id);
    return true;
  }

  @Post(':id/add-file')
  @ApiOkResponse({
    description: 'Add file to file list',
    type: Boolean
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'tmp/uploads',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async addFile(@Param('id') id, @UploadedFile() file): Promise<boolean> {
    this.filesService.uploadImagesFor('ITEM', id, [file]);
    return true;
  }

  @Post(':id/remove-file')
  @ApiOkResponse({
    description: 'Remove file from list',
    type: Boolean
  })
  async removeFile(@Param('id') id): Promise<boolean> {
    this.filesService.remove(id);
    return true;
  }
}
