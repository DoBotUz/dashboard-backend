import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto';
import { Category } from './category.entity';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FilesService } from 'src/files/files.service';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private filesService: FilesService
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of Categories',
    isArray: true,
    type: Category
  })
  async list(@UserD() user, @Param("bot_id") bot_id): Promise<Category[]> {
    return this.categoriesService.listAll(bot_id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get category by id',
    type: Category
  })
  async get(@UserD() user, @Param("id") id): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Category
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
  async create(@UserD() user, @Body() data: CreateCategoryDTO, @UploadedFiles() uploadedFiles): Promise<Category> {
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
      this.filesService.uploadImagesFor('CATEGORY', model.id, uploadedFiles.files);
    }
    return model;
  }

  @Post("update")
  @ApiOkResponse({
    description: 'Sucessfuly Updated',
    type: Category
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/categories/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async update(@Body() updateCategoryDto: UpdateCategoryDTO,  @UploadedFile() thumbnail): Promise<Category> {
    const { id, ...data } = updateCategoryDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
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
    this.filesService.uploadImagesFor('CATEGORY', id, [file]);
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
