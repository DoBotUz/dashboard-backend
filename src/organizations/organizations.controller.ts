import * as fs from 'fs';
import { Controller, UseGuards, Post, Body, Get, Param, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import {ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationBranchBotDTO, UpdateOrganizationDTO } from './dto';
import { BranchesService } from 'src/branches/branches.service';
import { BotsService } from 'src/bots/bots.service';
import { BotsGateway } from 'src/gateways/bots/bots.gateway';
import { Organization } from './organization.entity';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FilesService } from 'src/files/files.service';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(
    private organizationsService: OrganizationsService,
    private branchesService: BranchesService,
    private botsService: BotsService,
    private botsGateway: BotsGateway,
    private filesService: FilesService
  ) {}
  
  @Post()
  @ApiOkResponse({
    description: 'Sucessfuly Created',
    type: Organization
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
  async create(@UserD() user, @Body() data: CreateOrganizationBranchBotDTO, @UploadedFiles() uploadedFiles): Promise<any> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/organizations/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const org = await this.organizationsService.createNew({
      user_id: user.id,
      ...data
    });
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('ORGANIZATION', org.id, uploadedFiles.files);
    }
    const bot = await this.botsService.createNew({
      organization_id: org.id,
      ...data.bot,
    });
    this.botsGateway.newBot(bot.id);
    return {
      organization: org,
      bot,
    };
  }

  @Get()
  @ApiOkResponse({
    description: 'List of Orgnizations',
    isArray: true,
    type: Organization
  })
  async list(@UserD() user): Promise<Organization[]> {
    return await this.organizationsService.listAllUsers(user.id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get organization by id',
    type: Organization
  })
  async get(@UserD() user, @Param("id") id): Promise<Organization> {
    return await this.organizationsService.findOneUsersById(user.id, id);
  }

  @Post('update')
  @ApiOkResponse({
    description: 'Sucessfuly Update',
    type: Organization
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/categories/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async update(@UserD() user, @Body() updateOrganizationDTO: UpdateOrganizationDTO, @UploadedFile() thumbnail): Promise<any> {
    const { id, ...data } = updateOrganizationDTO;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    return this.organizationsService.updateOne(id, data);
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
    this.filesService.uploadImagesFor('ORGANIZATION', id, [file]);
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
}
