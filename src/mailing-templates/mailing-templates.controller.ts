import * as fs from 'fs';
import { Controller, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles, Get, Delete, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, Feature, Action, } from '@nestjsx/crud';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { CreateMailingTemplateDto, UpdateMailingTemplateDto } from './dto';
import { MailingTemplate, CATS_ARRAY, STATUSES } from 'src/mailing-templates/mailing-template.entity';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { MailingTemplatesCrudService } from './mailing-templates-crud.service';
import { MailingTemplatesService } from './mailing-templates.service';
import { BotNotificationsService } from 'src/bot-notifications/bot-notifications.service';
import { classToPlain } from 'class-transformer';
import { BotsGateway } from 'src/gateways/bots/bots.gateway';
import { ACLGuard } from 'src/common/guards/ACL.guard';
import { AppRoles } from 'src/app.roles';


@Crud({
  model: {
    type: MailingTemplate
  },
  routes: {
    only: ['getManyBase', 'getOneBase',],
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
  filter: (user: User) => {
    if (user.role == AppRoles.admin)
      return { 'organization.userId': user.id }
    return { 'organization.id': user.organizationId }
  }
})
@ApiTags('mailing-templates')
@Controller('/:organizationId/mailing-templates')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard,
  ACLGuard
)
@Feature('mailing-templates')
export class MailingTemplatesController implements CrudController<MailingTemplate>{
  constructor(
    public service: MailingTemplatesCrudService,
    private mailingTempaltesService: MailingTemplatesService,
    private filesService: FilesService,
    private botNotificationSErvice: BotNotificationsService,
    private botsGateway: BotsGateway,
  ) {}

  @Post('')
  @ApiOkResponse({
    description: 'MailingTemplate',
    type: MailingTemplate
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
  @Action('Create-One')
  async createTemplate(@UserD() user, @Body() data: CreateMailingTemplateDto, @UploadedFiles() uploadedFiles): Promise<MailingTemplate> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/mailing-templates/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const model = await this.mailingTempaltesService.createNew(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor(FILE_KEYS.MAILING_TEMPLATE, model.id, uploadedFiles.files);
    }
    return model;
  }

  @Post('update')
  @ApiOkResponse({
    description: 'MailingTemplate',
    type: MailingTemplate
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/mailing-templates/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  @Action('Update-One')
  async updateTemplate(@UserD() user, @Body() updateTemplateDto: UpdateMailingTemplateDto, @UploadedFile() thumbnail): Promise<MailingTemplate> {
    const { id, ...data } = updateTemplateDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    return this.mailingTempaltesService.updateOne(id, data);
  }

  @Get(':id/files')
  @Action('Read-One')
  async getFiles(@UserD() user, @Param('id') id): Promise<File[]> {
    // await this.validateCall(user, id);
    return this.filesService.findFilesByKeyAndId(FILE_KEYS.MAILING_TEMPLATE, id);
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
  @Action('Update-One')
  async addFile(@Param("id") id, @UploadedFile() file): Promise<boolean> {
    this.filesService.uploadImagesFor(FILE_KEYS.MAILING_TEMPLATE, id, [file]);
    return true;
  }

  @Post(":id/remove-file")
  @ApiOkResponse({
    description: 'Remove file from list',
    type: Boolean
  })
  @Action('Update-One')
  async removeFile(@Param("id") id): Promise<boolean> {
    this.filesService.remove(id);
    return true;
  }

  @Get('/categories')
  @ApiOkResponse({
    description: 'Get list of mailing cateogires',
    type: Boolean
  })
  @Action('Read-Many')
  async getCats(): Promise<any[]> {
    return CATS_ARRAY;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete mailing template',
    type: Boolean
  })
  @Action('Update-One')
  async deleteOne(@Param("id") id): Promise<boolean> {
    return this.mailingTempaltesService.removeOne(id);
  }

  @Post('start-draft/:id/:botId')
  @ApiOkResponse({
    description: 'Start mailing draft',
    type: Boolean
  })
  @Action('Update-One')
  async startOne(@Param("id") id, @Param("botId") botId): Promise<boolean> {
    const model = await this.mailingTempaltesService.findOne(id);
    if(!model){
      throw new BadRequestException('404');
    }
    model.status = STATUSES.SENDING;
    this.mailingTempaltesService.updateModel(model);
    const notif = await this.botNotificationSErvice.create({
      mailingTemplateId: model.id,
      botId
    });
    this.botsGateway.newBotNotification(notif.id);
    return true;
  }

  @Post('duplicate/:id')
  @ApiOkResponse({
    description: 'Duplicate template to draft',
    type: Boolean
  })
  @Action('Create-One')
  async duplicateOne(@Param("id") modelId): Promise<MailingTemplate> {
    const model = await this.mailingTempaltesService.findOne(modelId);
    if(!model){
      throw new BadRequestException('404');
    }
    const {id, organization, ...data} = <any>classToPlain(model);
    data.status = STATUSES.DRAFTS;
    return this.mailingTempaltesService.createNew(data);
  }
}
