import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { BotNotificationsService } from './bot-notifications.service';
import { CreateBotNotificationDto, UpdateBotNotificationDto, CreateBotNotificationTemplateDto, UpdateBotNotificationTemplateDto, CreateMassSendDto } from './dto';
import { BotNotification } from './bot-notification.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { FilesService } from 'src/files/files.service';
import { BotUsersService } from 'src/bot-users/bot-users.service';

@ApiTags('bot-notifications')
@Controller('bot-notifications')
@UseGuards(JwtAuthGuard)
export class BotNotificationsController {
  constructor(
    private botNotificationsService: BotNotificationsService,
    private botUsersService: BotUsersService,
    private filesService: FilesService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of BotNotifications',
    isArray: true,
    type: BotNotification
  })
  async list(@UserD() user, @Param("bot_id") bot_id): Promise<BotNotification[]> {
    return this.botNotificationsService.listAllBots(bot_id);
  }

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

  // @Post()
  // @ApiOkResponse({
  //   description: 'BotNotification',
  //   type: BotNotification
  // })
  // async create(@UserD() user, @Body() data: CreateBotNotificationDto): Promise<BotNotification> {
  //   const model = await this.botNotificationsService.create(data);
  //   this.botNotificationsService.setNotificationBotUsers(model.id, data.bot_user_ids);
  //   return model;
  // }

  // @Post('update')
  // @ApiOkResponse({
  //   description: 'BotNotification',
  //   type: BotNotification
  // })
  // async update(@UserD() user, @Body() updateNotificationDto: UpdateBotNotificationDto): Promise<BotNotification> {
  //   const { id, ...data } = updateNotificationDto;
  //   const model = await this.botNotificationsService.update(id, data);
  //   this.botNotificationsService.setNotificationBotUsers(model.id, data.bot_user_ids);
  //   return model;
  // }

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
      bot_id: data.bot_id,
      bot_notification_template_id: notificationTemplate.id,
      after_date_time: data.after_date_time
    });
    const bot_user_ids = (await this.botUsersService.listAll(data.bot_id)).map((botUser) => {
      return botUser.id;
    })
    // this.botNotificationsService.setNotificationBotUsers(model.id, bot_user_ids);
    return this.botNotificationsService.findOne(model.id);
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
