import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { BotNotificationsService } from './bot-notifications.service';
import { CreateBotNotificationDto, UpdateBotNotificationDto, CreateBotNotificationTemplateDto, UpdateBotNotificationTemplateDto } from './dto';
import { BotNotification } from './bot-notification.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { FilesService } from 'src/files/files.service';
import { BotNotificationBotUser } from './bot-notification-bot-user.entity';

@ApiTags('bot-notifications')
@Controller('bot-notifications')
@UseGuards(JwtAuthGuard)
export class BotNotificationsController {
  constructor(
    private botNotificationsService: BotNotificationsService,
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
    data.type = BotNotificationTemplate.TYPES.MASS_SEND;
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
    data.type = BotNotificationTemplate.TYPES.MASS_SEND;
    return this.botNotificationsService.updateTemplate(id, data);
  }

  @Post()
  @ApiOkResponse({
    description: 'BotNotification',
    type: BotNotification
  })
  async create(@UserD() user, @Body() data: CreateBotNotificationDto): Promise<BotNotification> {
    const model = await this.botNotificationsService.create(data);
    this.setNotificationBotUsers(model.id, data.bot_user_ids);
    return model;
  }

  @Post('update')
  @ApiOkResponse({
    description: 'BotNotification',
    type: BotNotification
  })
  async update(@UserD() user, @Body() updateNotificationDto: UpdateBotNotificationDto): Promise<BotNotification> {
    const { id, ...data } = updateNotificationDto;
    const model = await this.botNotificationsService.update(id, data);
    this.setNotificationBotUsers(model.id, data.bot_user_ids);
    return model;
  }

  private async setNotificationBotUsers(bot_notification_id: number, bot_user_ids: number[]): Promise<void> {
    await this.botNotificationsService.deleteBotUsers(bot_notification_id, bot_user_ids);
    for (let i = 0; i < bot_user_ids.length; i += 1) {
     await this.botNotificationsService.assignNotification({
        bot_notification_id,
        bot_user_id: bot_user_ids[i],
        status: BotNotificationBotUser.STATUSES.PENDING
      });
    }
  }
}
