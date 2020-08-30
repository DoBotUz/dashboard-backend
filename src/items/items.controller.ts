import * as fs from 'fs';
import { Controller, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth, Action, Feature, } from '@nestjsx/crud';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto, UpdateItemStatusDto } from './dto';
import { Item, STATUSES } from './item.entity';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { ItemsCrudService } from './items-crud.service';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';
import { ACLGuard } from 'src/common/guards/ACL.guard';
import { AppRoles } from 'src/app.roles';


@Crud({
  model: {
    type: Item
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase',],
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
@ApiTags('items')
@Controller('/:organizationId/items')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard,
  ACLGuard
)
@Feature('items')
export class ItemsController implements CrudController<Item> {
  constructor(
    public service: ItemsCrudService,
    private itemsService: ItemsService,
    private filesService: FilesService,
    private usersService: UsersService,
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
  @Action('Create-One')
  async createOne(@UserD() user, @Body() data: CreateItemDto, @UploadedFiles() uploadedFiles): Promise<Item> {
    await this.validateCall(user, Number(data.organizationId));
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
      this.filesService.uploadImagesFor(FILE_KEYS.ITEM, model.id, uploadedFiles.files);
    }
    return model;
  }

  @Post("/update")
  @ApiOkResponse({
    description: 'Updates one item',
    type: Item
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/items/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  @Action('Update-One')
  async updateOne(@UserD() user, @Body() updateItemDto: UpdateItemDto, @UploadedFile() thumbnail): Promise<Item> {
    const item = await this.itemsService.findOne(updateItemDto.id);
    await this.validateCall(user, Number(item.organizationId));
    
    const { id, ...data } = updateItemDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    return this.itemsService.updateOne(id, data);
  }

  
  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Item
  })
  @Action('Update-One')
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdateItemStatusDto): Promise<Item> {
    const item = await this.itemsService.findOne(updateStatusDto.id);
    await this.validateCall(user, Number(item.organizationId));
    const { id, ...data } = updateStatusDto;
    return this.itemsService.updateOne(id, data);
  }

  @Get(':id/files')
  @Action('Read-One')
  async getFiles(@UserD() user, @Param('id') id): Promise<File[]> {
    await this.validateCall(user, Number(id));
    return this.filesService.findFilesByKeyAndId(FILE_KEYS.ITEM, id);
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
  @Action('Update-One')
  async addFile(@Param('id') id, @UploadedFile() file): Promise<boolean> {
    this.filesService.uploadImagesFor(FILE_KEYS.ITEM, id, [file]);
    return true;
  }

  @Post(':id/remove-file')
  @ApiOkResponse({
    description: 'Remove file from list',
    type: Boolean
  })
  @Action('Update-One')
  async removeFile(@Param('id') id): Promise<boolean> {
    this.filesService.remove(id);
    return true;
  }

  private async validateCall(user, id: number){
    if (!user.roles.includes(AppRoles.admin)) {
      if (user.organizationId !== id) {
        throw new BadRequestException('Wrong input');
      }
      return;
    }

    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
