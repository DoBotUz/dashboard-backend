import * as fs from 'fs';
import { Controller, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, } from '@nestjsx/crud';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { BotNotificationsService } from './bot-notifications.service';
import { CreateBotNotificationTemplateDto, UpdateBotNotificationTemplateDto, CreateMassSendDto } from './dto';
import { BotNotification } from './bot-notification.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { BotUsersService } from 'src/bot-users/bot-users.service';
import { BotNotificationsCrudService } from './bot-notifications-crud.service';
import { User } from 'src/users/user.entity';
import { BotGuard } from 'src/common/guards/BotsGuard';


@Crud({
  model: {
    type: BotNotification
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC',
      },
    ],
    join: {
      bot: {
        eager: true,
      },
      'bot.organization': {
        eager: true,
        select: false,
      },
    },
  },
  params: {
    botId: {
      field: 'botId',
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
@ApiTags('bot-notifications')
@Controller('/:botId/bot-notifications')
@UseGuards(
  JwtAuthGuard,
  BotGuard
)
export class BotNotificationsController implements CrudController<BotNotification>{
  constructor(
    public service: BotNotificationsCrudService,
    private botNotificationsService: BotNotificationsService,
    private botUsersService: BotUsersService,
    private filesService: FilesService,
  ) {}

  @Post('template')
  @ApiOkResponse({
    description: 'BotNotificationTemplate',
    type: BotNotificationTemplate
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
  async createTemplate(@UserD() user, @Body() data: CreateBotNotificationTemplateDto, @UploadedFiles() uploadedFiles): Promise<BotNotificationTemplate> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/bot-notifications/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const model = await this.botNotificationsService.createTemplate(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('NOTIFICATION_TEMPLATE', model.id, uploadedFiles.files);
    }
    return model;
  }

  @Post('template/update')
  @ApiOkResponse({
    description: 'BotNotificationTemplate',
    type: BotNotificationTemplate
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/bot-notifications/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async updateTemplate(@UserD() user, @Body() updateTemplateDto: UpdateBotNotificationTemplateDto, @UploadedFile() thumbnail): Promise<BotNotificationTemplate> {
    const { id, ...data } = updateTemplateDto;
    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    return this.botNotificationsService.updateTemplate(id, data);
  }

  @Post('mass-send')
  @ApiOkResponse({
    description: 'BotNotification',
    type: BotNotification
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
  async createMassSend(@UserD() user, @Body() data: CreateMassSendDto, @UploadedFiles() uploadedFiles): Promise<BotNotification> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.template.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/bot-notifications/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const notificationTemplate = await this.botNotificationsService.createTemplate(data.template);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('NOTIFICATION_TEMPLATE', notificationTemplate.id, uploadedFiles.files);
    }
    const model = await this.botNotificationsService.create({
      botId: data.botId,
      templateId: notificationTemplate.id,
      after_date_time: data.after_date_time
    });
    const bot_user_ids = (await this.botUsersService.listAllByBotId(data.botId)).map((botUser) => {
      return botUser.id;
    })
    this.botNotificationsService.setNotificationBotUsers(model.id, bot_user_ids);
    return this.botNotificationsService.findOne(model.id);
  }

  @Get(':id/files')
  async getFiles(@UserD() user, @Param('id') id): Promise<File[]> {
    // await this.validateCall(user, id);
    return this.filesService.findFilesByKeyAndId(FILE_KEYS.NOTIFICATION_TEMPLATE, id);
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
    this.filesService.uploadImagesFor('NOTIFICATION_TEMPLATE', id, [file]);
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
