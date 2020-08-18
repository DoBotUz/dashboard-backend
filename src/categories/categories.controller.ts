import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, Delete, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, UpdateCategoryStatusDto } from './dto';
import { Category, STATUSES } from './category.entity';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { CategoriesCrudService } from './categories-crud.service';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';


@Crud({
  model: {
    type: Category
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase'],
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
      parent_category: {
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
@ApiTags('categories')
@Controller('/:organizationId/categories')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard
)
export class CategoriesController implements CrudController<Category> {
  constructor(
    public service: CategoriesCrudService,
    private categoriesService: CategoriesService,
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
  async createOne(@UserD() user, @Body() data: CreateCategoryDto, @UploadedFiles() uploadedFiles): Promise<Category> {
    await this.validateCall(user, data.organizationId);

    if (data.parentCategoryId) {
      const parentCategory = await this.categoriesService.findOne(data.parentCategoryId);
      await this.validateCall(user, parentCategory.organizationId);
    }

    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/categories/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const model = await this.categoriesService.createNew(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor(FILE_KEYS.CATEGORY, model.id, uploadedFiles.files);
    }
    return model;
  }

  @Post("/update")
  @ApiOkResponse({
    description: 'Updates one category',
    type: Category
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/categories/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async updateOne(@UserD() user, @Body() updateCategoryDto: UpdateCategoryDto,  @UploadedFile() thumbnail): Promise<Category> {
    const category = await this.categoriesService.findOne(updateCategoryDto.id);
    await this.validateCall(user, category.organizationId);

    if (updateCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoriesService.findOne(updateCategoryDto.parentCategoryId);
      await this.validateCall(user, parentCategory.organizationId);
    }

    const { id, ...data } = updateCategoryDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    return this.categoriesService.updateOne(id, data);
  }

  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Category
  })
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdateCategoryStatusDto): Promise<Category> {
    const item = await this.categoriesService.findOne(updateStatusDto.id);
    await this.validateCall(user, item.organizationId);
    const { id, ...data } = updateStatusDto;
    return this.categoriesService.updateOne(id, data);
  }

  @Get(':id/files')
  async getFiles(@UserD() user, @Param('id') id): Promise<File[]> {
    await this.validateCall(user, id);
    return this.filesService.findFilesByKeyAndId(FILE_KEYS.CATEGORY, id);
  }

  @Post(":id/add-file")
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
  async addFile(@Param("id") id, @UploadedFile() file): Promise<boolean> {
    this.filesService.uploadImagesFor(FILE_KEYS.CATEGORY, id, [file]);
    return true;
  }

  @Post(":id/remove-file")
  @ApiOkResponse({
    description: 'Remove file from list',
    type: Boolean
  })
  async removeFile(@Param("id") id): Promise<boolean> {
    this.filesService.remove(id);
    return true;
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
